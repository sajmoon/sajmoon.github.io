---
title: Android starter - What is what and how do I use it?
date: "2018-04-24"
draft: true
---

# Android

Android is a strange eco system. This is just a quick summary of concepts that
are important.

## Summary of core concepts in android

- Zygote
- Binder
- Looper
- Intent
- Application
- Core components
  - Activities (Fragments, life cycles)
  - Content provider
  - Broadcast receivers
  - Services (Note: If your app targets Android 5.0 (API level 21) or later, use the JobScheduler)
- Gradle
- Resources (Layouts, colors, strings etc)

## Zygote

In any stacktrace you will see a zygote process, which is the base process which
all android apps fork from. All apps running on your device has the same pid.

To keep app start snappy instead of loading all dependencies the system boots
them once and for all subsequent app starts for that process. This process is
called Zygote.

This fork contains the needed libraries, java classes preloaded etc.

## Gradle

Gradle is the build system used by android, and it is pretty simple. We specify
dependencies and how to build our application.

Some notes:
- A android project can have `flavors`. This is basically several version of the
app, such as free and paid if you want to ship different code to different
users. Used to sepearate on features.
- Variants are used to separate different builds, such as debug vs release. Used
  to separate on config, such as which backend to use. Things that does not affect the product, but might speed up development builds or change dependent systems.
- `BuildConfig` contains information compiled during the build process. Version
code, application id etc. But also information on the flavor or build variant,
and using this we can customize the app further.

There is a lot of optimizations and customizations one can do to it.

## MainApplication, extends Application

Your stating point. Here you can do things that needs to be done during
application bootup, such as track app start or whatever.

```java
public class MainApplication extends Application {

  @Override
  public void onCreate() {
    super.onCreate()
  }
}
```

It is sometimes refered to as ApplicationDelegate

For example if the device is low on memory this `Application.onLowMemory()` is
called so you can react.


## Core

### Activities and Fragment

Activities are sort of a ViewController, that you can only have one at a time
of. (This is not really true, but true enough).

Fragments are fragments, partials you can have many of in a view.
Both have lifecycle events, and might be destroyed at random times.
The lifecycle of these to differ from each other, and as everything in android,
is not really concistent.

You need atleast one activity, you cannot have an app without one. You can have an app without fragments. For every new view you want to show your users you can start a new activity, or
you can show a fragment.

The main difference is how you start them. Activities cannot be started
directly. We start them by creating an Intent, with all parameters needed to
start the activity, and ask the system to start it. This is handled by Zygote
internally.

```java
Intent intent = new Intent(this, MyCoolActivity.class)
intent.put(data)
startActivity(intent)
```

Because of this we cannot communicate directly with activities.

Fragments can be started directly by us, and therefore we can communicate with
it more directly. Here is a sample from
[stackoverflow](https://stackoverflow.com/questions/36100187/how-to-start-fragment-from-an-activity):

```java
FragmentManager manager = getFragmentManager();
FragmentTransaction transaction = manager.beginTransaction();
transaction.add(R.id.container,YOUR_FRAGMENT_NAME,YOUR_FRAGMENT_STRING_TAG);
transaction.addToBackStack(null);
transaction.commit();
```

You can build a _single activity application_ using fragments for all screens, and that might solve a lot of the problems with activities. However it comes with a complete new set of problems mainly memory management, and handling destruction of the fragments view.

### Content providers
[documentation](https://developer.android.com/guide/topics/providers/content-providers.html)

A way to provide data from your app to other apps on the device. One example is
the user dictionary which contains custom spelling of words the user wants to
keep.

You can both use premade content providers, or create your own and share data
with all other apps on the device.

### BroadcastReceivers
[documentation](https://developer.android.com/guide/components/broadcasts.html)

It's a pub-sub of events that occur on the system. The os sends messages such as
the phone started charing, or the phone went into airplane mode.

The information comes as an intent.

You can send events:

```java
Intent intent = new Intent();
intent.setAction("com.example.broadcast.MY_NOTIFICATION");
intent.putExtra("data","Notice me senpai!");
sendBroadcast(intent);
```

You can send to all receivers, to all in order or just to receivers in the same app.

Useful for 
- reacting to system events
- reacting to other apps
- inter-app communication
- As a internal pub-sub in the app (NotificationCenter in ios)
- running background tasks when events occur

### Services, JobScheduler

Run jobs in the background.
Service can perform long running operations in the background.
[documentation](https://developer.android.com/guide/components/services.html)
JobScheduler can schedule tasks to run when certain conditions are met.
[documentation](https://developer.android.com/reference/android/app/job/JobScheduler.html)

## Context


# More
Activities (fragments, life cycles), Content provider, Broadcast receivers, Services (Note: If your app targets Android 5.0 (API level 21) or later, use the JobScheduler)

Activity typ som en viewController.

Man har inte en construcotr. Man kan inte vet n'r den skapas


## Context

mappning entill vart du är nu. ApplicationContext eller activity context.
Activity är ett context i sig.
LayoutInflater.from(this)

Context kan innehåller saker som theme etc.

Aktivity kan bara ha en child.
Views kan inte ha childs alls.
Lägg views i viewgroups, t ex LineraLayouts.

AttributeSet: används i contructors för view om de skapas av android automatiskt. De kan innehålla t ex theme.


R.id

R filen genraras av saker i xml, men blir en java class.
Du får compile time checks på typ idn.

Man kan inte prata mellan aktiviter. De pratar via intent till oset.
Använder binder för att skicka info.

Varje aktivite är ansvarig för att spara sitt eget state.

Det som sparas autoamtiskt

hela vy träder om du satt ett id.
T ex en textView med text, då sparas texten

Dödar aktivit genom att kalla finish.
TaskStack stack av aktiviter.
Nya tasks får en egen activity stack.

För att starta en ny aktivitet, gör det genom intent.

new intent. tar context, och class.

Intent i = new Intent(this, DispatchActivky.class)

getIntent() svarar med intentet som startade dig.

Intent i = new Intent()

i.addFlag f;r att t ex sätta discard all previous activities.

startActivityForResult om du bryr dig om resultatet.
Svaret kommer i en egen lifecycle method onActivktyResult eller liknande.


Life cycle.

onNewInent om du får ett push men appen redan är startad t ex.

onStart-onStop typ om du behöver starta nätverks grejer
onResume då ser man viewn.
onAttachedToWindow, kan ha något att göra med om fragemnst är attacged

https://github.com/xxv/android-lifecycle

Fragment onCreateView skapar du vy träd cohs ne ska du returnera. Varför?
Aktiviten får tillbaka och adderar det till sitt vy träd.

Flow and mortar 
Blir en singel activity app, fragment kan man ha access till direkt. startas inte av intent.
Lyfts scoop, samma sak.

Services och JobSchedules
kör i backgroundn

BroadcastReceivers + Lyssnar på andra appar.
Twitter kanske skickar varje tweet.
Typ call ended. Alternativ onCharging kanske kommer som ett lify cycle.
onConfigurationChange kanske kommer om rotation ändras.

ContentProviders
Jag erbjuder den här typen av data. Inte event. Tex telefonboken.
Hur accessar man den?

Typ ett api för folk att hämta data av dig.

Intent i ´new intent(this, UserActivkty.class)


# TODO

startActivity and startActivityForResult
