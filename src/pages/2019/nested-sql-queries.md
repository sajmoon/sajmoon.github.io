
## Original

```ruby
clubs = current_club_admin.managed_clubs.order(:name)

clubs.each 
<%= clubs.teams.count %>
<%= clubs.users %>

```

clubs.explain:


```sql

  Club Load (1.8ms)  SELECT "clubs".* FROM "clubs" INNER JOIN "users_clubs" ON "clubs"."id" = "users_clubs"."club_id" WHERE "users_clubs"."user_id" = $1 ORDER BY "clubs"."name" ASC  [["user_id", 4]]
  ↳ app/controllers/clubs/clubs_controller.rb:10
EXPLAIN for: SELECT "clubs".* FROM "clubs" INNER JOIN "users_clubs" ON "clubs"."id" = "users_clubs"."club_id" WHERE "users_clubs"."user_id" = $1 ORDER BY "clubs"."name" ASC [["user_id", 4]]
                                                 QUERY PLAN
-------------------------------------------------------------------------------------------------------------
 Sort  (cost=27.18..27.19 rows=6 width=301)
   Sort Key: clubs.name
   ->  Hash Join  (cost=13.74..27.10 rows=6 width=301)
         Hash Cond: (clubs.id = users_clubs.club_id)
         ->  Seq Scan on clubs  (cost=0.00..12.40 rows=240 width=301)
         ->  Hash  (cost=13.67..13.67 rows=6 width=8)
               ->  Bitmap Heap Scan on users_clubs  (cost=4.20..13.67 rows=6 width=8)
                     Recheck Cond: (user_id = '4'::bigint)
                     ->  Bitmap Index Scan on index_users_clubs_on_user_id  (cost=0.00..4.20 rows=6 width=0)
                           Index Cond: (user_id = '4'::bigint)

```

Classic N+1 query 

### Superjoin

```
    @old_clubs = current_club_admin
      .managed_clubs
      .select("clubs.id, clubs.name, count(distinct(users.id)) as users_count, count(distinct(teams.id)) as teams_count")
      .left_outer_joins(:users, :teams)
      .group("clubs.id")
```

explain

```
  Club Load (1.2ms)  SELECT clubs.id, clubs.name, count(distinct(users.id)) as users_count, count(distinct(teams.id)) as teams_count FROM "clubs" INNER JOIN "users_clubs" ON "clubs"."id" = "users_clubs"."club_id" LEFT OUTER JOIN "users" ON "users"."club_id" = "clubs"."id" LEFT OUTER JOIN "teams" ON "teams"."club_id" = "clubs"."id" AND "teams"."deleted_at" IS NULL WHERE "users_clubs"."user_id" = $1 GROUP BY clubs.id  [["user_id", 4]]
  ↳ app/controllers/clubs/clubs_controller.rb:37
EXPLAIN for: SELECT clubs.id, clubs.name, count(distinct(users.id)) as users_count, count(distinct(teams.id)) as teams_count FROM "clubs" INNER JOIN "users_clubs" ON "clubs"."id" = "users_clubs"."club_id" LEFT OUTER JOIN "users" ON "users"."club_id" = "clubs"."id" LEFT OUTER JOIN "teams" ON "teams"."club_id" = "clubs"."id" AND "teams"."deleted_at" IS NULL WHERE "users_clubs"."user_id" = $1 GROUP BY clubs.id [["user_id", 4]]
                                                             QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------------
 GroupAggregate  (cost=34.33..34.45 rows=6 width=52)
   Group Key: clubs.id
   ->  Sort  (cost=34.33..34.35 rows=6 width=44)
         Sort Key: clubs.id
         ->  Nested Loop Left Join  (cost=27.33..34.25 rows=6 width=44)
               ->  Hash Right Join  (cost=27.18..31.78 rows=6 width=40)
                     Hash Cond: (users.club_id = clubs.id)
                     ->  Seq Scan on users  (cost=0.00..4.43 rows=43 width=8)
                     ->  Hash  (cost=27.10..27.10 rows=6 width=36)
                           ->  Hash Join  (cost=13.74..27.10 rows=6 width=36)
                                 Hash Cond: (clubs.id = users_clubs.club_id)
                                 ->  Seq Scan on clubs  (cost=0.00..12.40 rows=240 width=36)
                                 ->  Hash  (cost=13.67..13.67 rows=6 width=8)
                                       ->  Bitmap Heap Scan on users_clubs  (cost=4.20..13.67 rows=6 width=8)
                                             Recheck Cond: (user_id = '4'::bigint)
                                             ->  Bitmap Index Scan on index_users_clubs_on_user_id  (cost=0.00..4.20 rows=6 width=0)
                                                   Index Cond: (user_id = '4'::bigint)
               ->  Index Scan using index_teams_on_club_id on teams  (cost=0.15..0.40 rows=1 width=8)
                     Index Cond: (club_id = clubs.id)
                     Filter: (deleted_at IS NULL)
(20 rows)
```


### Nested queries

What we want

```sql
SELECT id, name, COALESCE(b.user_counts, 0) as user_counts, COALESCE(a.team_counts, 0) as team_counts FROM clubs LEFT OUTER JOIN (SELECT club_id, count(id) as team_counts FROM teams GROUP BY club_id) a ON a.club_id = id LEFT OUTER JOIN (SELECT club_id, count(id) as user_counts FROM users GROUP BY club_id) b ON b.club_id = id
```

In activerecord talk


Explained

```sql
EXPLAIN for: SELECT "clubs"."id", "clubs"."name", COALESCE(clubs_teams_count.teams_count, 0) as teams_count, COALESCE(clubs_users_count.users_count, 0) as users_count FROM "clubs" INNER JOIN "users_clubs" ON "clubs"."id" = "users_clubs"."club_id" LEFT OUTER JOIN (SELECT club_id, count(id) as teams_count FROM teams GROUP BY club_id) clubs_teams_count ON clubs_teams_count.club_id = clubs.id LEFT OUTER JOIN (SELECT club_id, count(id) as users_count FROM users GROUP BY club_id) clubs_users_count ON clubs_users_count.club_id = clubs.id WHERE "users_clubs"."user_id" = $1 ORDER BY "clubs"."name" ASC [["user_id", 4]]
                                                          QUERY PLAN
-------------------------------------------------------------------------------------------------------------------------------
 Sort  (cost=55.48..55.50 rows=6 width=52)
   Sort Key: clubs.name
   ->  Hash Left Join  (cost=50.59..55.40 rows=6 width=52)
         Hash Cond: (clubs.id = clubs_users_count.club_id)
         ->  Hash Right Join  (cost=45.88..50.68 rows=6 width=44)
               Hash Cond: (teams.club_id = clubs.id)
               ->  HashAggregate  (cost=18.70..20.70 rows=200 width=12)
                     Group Key: teams.club_id
                     ->  Seq Scan on teams  (cost=0.00..15.80 rows=580 width=8)
               ->  Hash  (cost=27.10..27.10 rows=6 width=36)
                     ->  Hash Join  (cost=13.74..27.10 rows=6 width=36)
                           Hash Cond: (clubs.id = users_clubs.club_id)
                           ->  Seq Scan on clubs  (cost=0.00..12.40 rows=240 width=36)
                           ->  Hash  (cost=13.67..13.67 rows=6 width=8)
                                 ->  Bitmap Heap Scan on users_clubs  (cost=4.20..13.67 rows=6 width=8)
                                       Recheck Cond: (user_id = '4'::bigint)
                                       ->  Bitmap Index Scan on index_users_clubs_on_user_id  (cost=0.00..4.20 rows=6 width=0)
                                             Index Cond: (user_id = '4'::bigint)
         ->  Hash  (cost=4.68..4.68 rows=2 width=12)
               ->  Subquery Scan on clubs_users_count  (cost=4.64..4.68 rows=2 width=12)
                     ->  HashAggregate  (cost=4.64..4.66 rows=2 width=12)
                           Group Key: users.club_id
                           ->  Seq Scan on users  (cost=0.00..4.43 rows=43 width=8)
(23 rows)
```sql


Extracted to composable subqueries:

```ruby
  user_count_query = Club.all.select("COALESCE(b.users_count, 0) as users_count").joins("LEFT OUTER JOIN (SELECT club_id, count(id) as users_count FROM users GROUP BY club_id) b ON b.club_id = clubs.id")

  team_count_query = Club.all.select("COALESCE(a.teams_count, 0) as teams_count").joins("LEFT OUTER JOIN (SELECT club_id, count(id) as teams_count FROM teams GROUP BY club_id) a ON a.club_id = clubs.id")

  some_clubs = current_club_admin.managed_clubs
  clubs = some_clubs
  .order(:name)
  .select(:id, :name)
  .merge(user_count_query)
  .merge(team_count_query)
```

extracting

```ruby
class Club < ActiveRecord::Base

  # Queries
  def self.with_teams_count
    Club.select("COALESCE(clubs_teams_count.teams_count, 0) as teams_count")
      .joins("LEFT OUTER JOIN (SELECT club_id, count(id) as teams_count FROM teams GROUP BY club_id) clubs_teams_count ON clubs_teams_count.club_id = clubs.id")
  end

  def self.with_users_count
    Club.select("COALESCE(clubs_users_count.users_count, 0) as users_count")
      .joins("LEFT OUTER JOIN (SELECT club_id, count(id) as users_count FROM users GROUP BY club_id) clubs_users_count ON clubs_users_count.club_id = clubs.id")
  end

end

def ClubsController < ActionController::Base
  def index
    @clubs = current_club_admin.managed_clubs
      .order(:name)
      .select(:id, :name)
      .merge(Club.with_teams_count)
      .merge(Club.with_users_count)
  end
end
```

misses pagination.
The inner query is not paginated

```
@teams = sorted_collection(current_club.teams)
    .select("teams.name, teams.id, teams.age, count(distinct(users.id)) as users_count")
    .left_outer_joins(:users)
    .group("teams.id")
    .page(pagination_params[:page])
     .per(10000000)
```
