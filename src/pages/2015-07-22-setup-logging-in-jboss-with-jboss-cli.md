---
title: Setup logging in JBOSS with jboss cli.
slug: setup-logging-in-jboss-with-jboss-cli
date: 2015-07-22T17:39:11.645Z
---

# Logging in JBOSS.

Let us setup  some logging rules for JBoss.

We want our log to be split between two files. A `server.log` that contains information about the server; registration of modules etc, and än `application.log` that contains logs from file in our packages.

Let us use the jboss-cli. First connect to your server. We need to add the following properties. These should be set by the script that installs JBoss for you.

Add these properties:

```
/subsystem=logging/periodic-rotating-file-handler=HandlerName:add(autoflush=true,encoding="UTF-8",file={"path"=>"app.log","relative-to"=>"jboss.server.log.dir"},suffix=".yyyy-MM-dd",append="true"),
/subsystem=logging/periodic-rotating-file-handler=HandlerName:write-attribute(name=named-formatter, value="PATTERN") ,
/subsystem=logging/logger=com.company:add,
/subsystem=logging/logger=com.company:assign-handler(name="HandlerName"),
/subsystem=logging/logger=com.company:write-attribute(name="level", value="DEBUG"),
/subsystem=logging/logger=com.company:write-attribute(name="use-parent-handlers", value="false")
```

This will rotate logs when needed, and logs everything to its correct file.

`HandlerName`can be changed to whatever you want.
You should also set the correct packagename instead of `com.company`and you can rename the logfile. These rules match the package name of your files, so you can have different rules for all the different modules. 

You can read more in these old docs from the [redhat documentation.](https://access.redhat.com/documentation/en-US/JBoss_Enterprise_Application_Platform/6/html/Administration_and_Configuration_Guide/Configure_a_File_Log_Handler_in_the_CLI1.html)
