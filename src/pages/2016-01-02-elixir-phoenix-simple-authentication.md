---
title: "Elixir - Phoenix: Simple Authentication"
slug: elixir-phoenix-simple-authentication
date: 2016-01-02T14:22:26.768Z
tags: Elixir, Phoenix, ExUnit
---

A simple Phoenix authentication flow for an JSON api. Using [JSON Web Tokens](https://jwt.io/) via [Joken](https://github.com/bryanjos/joken) and [Mellon](https://github.com/sajmoon/mellon) for access controller.

## The basics.

Let's start from scratch. Create a new Phoenix Application. Read the [Phoenix guide](http://www.phoenixframework.org/docs/up-and-running) to get started.

```sh
$ mix phoenix.new --no-brunch app_name
$ cd app_name
$ mix ecto.setup
```

## Create a user model
We will use a generator now and remove most of the code, but obviously you don't have to.

```sh
$ mix phoenix.gen.json User users email:string password_hash:string
```

We will want the emails to be unique so modify the migration file to include the following that will generate a index of all emails for us.

```
create unique_index(:users, [:email])
```

We need to modify the routes, so let's do that. We start by adding all possible CRUD routes in `web/routes.ex`.

```
pipeline :api do
  plug :accepts, ["json"]
end

scope "/api/" do
  pipe_through :api
  resources "/users", UserController
end
```

Then fix the database.

```
$ mix ecto.migrate
```

We will not use the UserController but my memory is always messing with me and I need both the tests and controller to remember stuff.

## Registrate new users
New users will `POST` to `/auth/` all data needed and a user will be created.

The route will be:
```
scope "/api/" do
  pipe_through :api
  resources "/users", UserController
  
  post "/auth", RegistrationController, :create
end
```

So we need a new controller called `RegistrationController` located  in `web/controllers/registration_controller.ex`. The tests for that controller will be in `tests/controller/registration_controller_test.exs`. Create them both. See the full code further down.

When a user registers s/he will send some json containing email and password. In the end we will store password_hash in the db. For the hashing of the password we use [comeonin](https://github.com/elixircnx/comeonin).

After we get the basics up and running, for example an endpoint that can take some post data and return a 200, we should modify the changeset method in the model to accept password and hide the password_hash.

Be sure to write tests for your code. To have your tests run as soon as you save a file you can use [entr](http://entrproject.org/).

```
while sleep 1; do ls -d lib/**/*.ex web/**/*.ex test/**/*.exs | entr│ mix test; done
```

### User Model
We add a password field (virtual) to our model. That way we can pass it along from the user and convert it to a password_hash. We also change how the changeset works

```
schema "users" do
  field :email, :string
  field :password_hash, :string
  field :password, :string, virtual: true

  timestamps
end

@required_fields ~w(email password)

def changeset(model, params \\ :empty) do
  model
  |> cast(params, @required_fields, @optional_fields)
  |> unique_constraint(:email)
  |> validate_length(:password, min: 5)
  |> hash_password
end

defp hash_password(changeset) do
  if password = get_change(changeset, :password) do
    changeset
    |> put_change(:password_hash, hashpwsalt(password))
  else
    changeset
  end
end
```

We can test the password_hash in a model test:
```
test "password_hash value gets set to a hash" do
  changeset = User.changeset(%User{}, @valid_attrs)
  assert Comeonin.Bcrypt.checkpw(@valid_attrs.password, Ecto.Changeset.get_change(changeset, :password_hash))
end
```

You will obviously have to write more and better tests then this for a real system.

Also, remember to change the view of users so it returns no password, or password_hash.

The controller code and tests in full. You will see features omitted, such as validations of emails etc.

```
defmodule AppName.UserControllerTest do
  use AppName.ConnCase

  alias AppName.User
  @valid_attrs %{email: "some content", password: "validPassword"}
  @invalid_attrs %{}

  setup do
    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn}
  end

  test "creates and renders resource when data is valid", %{conn: conn} do
    conn = post conn, registration_path(conn, :create), user: @valid_attrs
    assert json_response(conn, 201)["data"]["id"]
    assert Repo.get_by(User, email: @valid_attrs.email)
  end

  test "does not create resource and renders errors when data is invalid", %{conn: conn} do
    conn = post conn, registration_path(conn, :create), user: @invalid_attrs
    assert json_response(conn, 422)["errors"] != %{}
  end

  test "Users should have unique emails", %{conn: conn} do
    post conn, registration_path(conn, :create), user: @valid_attrs
    conn = post conn, registration_path(conn, :create), user: @valid_attrs
    errors = json_response(conn, 422)["errors"]
    assert errors != %{}
    assert Map.has_key?(errors, "email")
    assert Map.get(errors, "email") == ["has already been taken"]
  end
end
```
And the controller itself:

```
defmodule AppName.RegistrationController do
  use AppName.Web, :controller

  alias AppName.User

  plug :scrub_params, "user" when action in [:create]

  def create(conn, %{"user" => user_params}) do
    changeset = User.changeset(%User{}, user_params)

    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render(AppName.UserView, "show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(AppName.ChangesetView, "error.json", changeset: changeset)
    end
  end
end
```

Now we have something that allows us to create new users. Let´s enable Sign ins.

## Sign ins

The user posts email and password, the server responds with 4xx if something went wrong. If the password matches the one stored in the database the server responds with 2xx and a Token.


Start by adding a new route
```
get "/auth/login", SessionController, :login
```

Create the controller and tests.


The tests will be something like this:
```
defmodule AppName.SessionControllerTest do
  use AppName.ConnCase

  alias AppName.User
  @valid_attrs %{email: "some content", password: "validPassword"}
  @invalid_attrs %{email: "non-existing-user@example.com", password: "no-password"}

  setup do
    changeset = User.changeset(%User{}, @valid_attrs)
    {:ok, user} = Repo.insert changeset
    token = User.generate_token(user)

    conn = conn() |> put_req_header("accept", "application/json")
    {:ok, conn: conn, user: user, token: token}
  end

  test "Cannot authenticate a non existing user", %{conn: conn} do
    conn = get conn, session_path(conn, :login), user: @invalid_attrs
    assert json_response(conn, 422)
  end

  test "Authenticate a valid user", %{conn: conn} do
    conn = get conn, session_path(conn, :login), user: @valid_attrs
    assert json_response(conn, 200)["data"]["token"] != nil
  end
end
```

The `generate_token` method is placed in the model to keep everything together, but could easily be placed in another file.

The controller for this looks 

```
defmodule AppName.SessionController do
  use AppName.Web, :controller

  alias AppName.User

  def login(conn, %{"user" => user_params}) do
    if user = Repo.get_by(User, email: user_params["email"]) do

      token = User.generate_token(user)

      conn
      |> put_status(200)
      |> render(AppName.SessionView, "session.json", token: token)
    else
      conn
      |> put_status(:unprocessable_entity)
      |> render(AppName.SessionView, "error.json", message: "Nope")
    end
  end
end
```

We generate the token via a helper method in the model. It looks like this:

```
def generate_token(user) do
  %{user_id: user.id}
  |> token
  |> with_signer(hs256("secret-change-me"))
  |> sign
  |> get_compact
end
```

All the magic is [Joken](https://github.com/bryanjos/joken), and you should read more about the options for it.

In short is contains the data on the second line (e.g. user_id: 1) but is signed so anyone with the secret can validate that the user is actually signed in without having to look up a random string token in the database. We can pass values such as the user id but also role: "admin" etc. We can use this later to get the current user for each request. Do not put anything secret in the claims part of the token, since it is readable by everyone.

Alright. That is it! We have a way to register user and a way to authenticate a user.

Now we only need to ensure that a unauthenticated user does not have access to thing s/he should not. This is the fun part.

### Validating an authenticated user

We will define some routes that are protected, for this example we will do a `/auth/validate` that responds with 200 if the user is authenticated. If not the response will be `401, Unauthticated`.


We will use Mellon to parse the header and provide an interface to validate the token. With mellon the token can be anything, it just hands the data to any function you define and you can handle the validations yourself.

Check out [Mellon](https://github.com/sajmoon/mellon) for more information.

In your routes create a new pipeline and a route that is protected.

```
pipeline :authenticated do
  plug Mellon, validator: {AppName.Validation, :validate, []}, header: "api-token"
end

scope "/api/", AppName do
  pipe_through :api
  pipe_through :authenticated
  get "/auth/validate", SessionController, :validate
end
```

and the controller:

```
def validate(conn, _params) do
  conn
  |> put_status(200)
  |> render(AppName.UserView, "show.json", user: %User{email: "test"})
end
```

The content to the view is temporary, and should probably be the user object itself.

To test this (before you add the `pipe_through :authenticated`) you can write some tests such as these:

```
test "validate token", %{conn: conn, token: token} do
  conn = put_req_header(conn, "api-token", "Token: " <> token)
  conn = get conn, session_path(conn, :validate)
  assert json_response(conn, 200)
end

test "validate fails if invalid token", %{conn: conn} do
  conn = put_req_header(conn, "api-token", "Token: invalid-token")
  conn = get conn, session_path(conn, :validate)
  assert json_response(conn, 401)
end
```

You should see one or both fail.

The pipeline will pass all request through the Mellon Plug, which will call `AppName.Validation.validate/1` with the information needed to authenticate or reject the request.

The validate method gets the conn and token. We use a helper method in the model to verify the token, and then pass the claims (the information we put in the token: user_id: user.id) in the connection.
Mellon will assign it to the connection so we can use it in the controller. Which is good for more granular access controller.

The validator looks like this.
```
defmodule AppName.Validation do
  import Joken
  alias AppName.User

  def validate({conn, token}) do
    User.verify_token(token)
    |> handle(conn)
  end

  defp handle(%{error: nil, claims: claims}, conn) do
    {:ok, claims, conn}
  end
  defp handle(%{error: error}, conn) do
    {:error, [], conn}
  end
end
```


## Conclusion

That it! We have a way to create users, authenticate users, and validate that the user is signed in with a valid token.

To do this we use [Mellon](https://github.com/sajmoon/mellon) to parse the headers, [Joken](https://github.com/bryanjos/joken) to create the token, and [comeonin](https://github.com/elixircnx/comeonin) to encrypt the password stored in the database.
