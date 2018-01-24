---
title: Change file encoding in the terminal.
slug: change-file-encoding-in-the-terminal
date: 2015-07-14T15:01:16.917Z
---

# The problem
We have a large legacy project that we are converting from an ant build to maven and from SunAS to JBOSS. We had some problems with file encoding. Special characters, such as Swedish letters, where encoded incorrectly.

So lets use the shell to help us with this.

Can we list  all files of a certain encoding? Sure.
```shell
$ find . -type f -exec file --mime {} \; | grep "charset=utf-16"
./ship/src/main/resources/sql/load_mysql.sql: text/plain; charset=utf-8
./ship/target/archive-tmp/fileSetFormatter.185046416.tmp/load_mysql.sql.654988221.filtered: text/plain; charset=utf-8
./ship/target/archive-tmp/fileSetFormatter.185046416.tmp/sql/load_app_mysql.sql: text/plain; charset=utf-8
etc
```

This list includes everything from `.git/` to files generated by the build. 

We can see the encoding at the end. Lets list all encodings in our app.

```shell
find . -type f -exec file --mime {} \; | grep "charset" | awk '{print $3}' | sort | uniq
charset=binary
charset=iso-8859-1
charset=unknown-8bit
charset=us-ascii
charset=utf-8
```

We can also list all files with a certain encoding.

```shell
find . -type f -exec file --mime {} \; | grep "charset=us-ascii"
```

Extract the filename of all files.

```shell
find . -type f -exec file --mime {} \; | grep "charset=iso-8859-1" | awk '{print $1}' | rev | cut -c 2- | rev
```
## iconv

List supported encodings.
```shell
iconv -l
```

convert a file to utf8.

```shell
iconv -f iso-8859-1 -t utf-8 ./src/main/webapp/WEB-INF/BcuLogin.properties > .src/main/webapp/WEB-INF/BcuLogin.properties2
```

As you can see we save a new file with the correct encoding. I could not get iconv to overwrite the original. You can ofcourse store in a temp file etc.

However `recode` is another tool, and it supports overwrite.

## recode
Simply converts from one encoding to the other. Overwriting the original file.
```shell
recode iso-8859-1..utf8 ./src/main/webapp/WEB-INF/BcuLogin.properties     
```

## Putting it all together
```shell
find . -type f -exec file --mime {} \; | grep "charset=iso-8859-1" | awk '{print $1}' | rev | cut -c 2- | rev | parallel recode iso-8859-1..utf8 {}
```

This lists all of a specific encoding, parses the filename, and re-encodes it with utf8.