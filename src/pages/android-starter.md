---
title: Notes from session with samuel
date: "2018-04-24"
draft: true
---
## Core concepts of android

- Binder
- Looper

## Zygote

Fork of a prestarted vm with standard libraries already loaded.


### Gradle

BuildConfig contains information about version etc.

### Main application, extends application

## Core

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



