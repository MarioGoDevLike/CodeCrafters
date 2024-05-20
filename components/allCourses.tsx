import reactnative from '../assets/courses/reactNative.jpg';
import nodeJs from '../assets/courses/NodeJs.jpg';
import flutter from '../assets/courses/Flutter.jpg';


const courses = [
    {
      image: reactnative,
      title: 'Learn React Native',
      whatyoulearn: `\u00A0\u00A0\u00A0\u00A0 ⌨️ (0:00:00) Introduction
      ⌨️ (0:01:25) What is React Native?
      ⌨️ (0:03:45) Expo
      ⌨️ (0:04:22) Setup with Expo
      ⌨️ (0:06:17) Setting up a custom app 
      ⌨️ (0:10:17) Setting up Android Studio 
      ⌨️ (0:12:03) The directory structure 
      ⌨️ (0:12:42) Setting up linting 
      ⌨️ (0:14:33) Setting up Prettier 
      ⌨️ (0:16:35) Debugging 
      ⌨️ (0:18:17) Native components 
      ⌨️ (0:19:00) Core components 
      ⌨️ (0:20:17) JSX 
      ⌨️ (0:21:29) Working with components 
      ⌨️ (0:21:57) What are components 
      ⌨️ (0:23:08) Creating our first component 
      ⌨️ (0:26:50) Styling basics 
      ⌨️ (0:31:17) Layout props 
      ⌨️ (0:32:37) The current weather screen 
      ⌨️ (0:40:17) Adding icons to the screen 
      ⌨️ (0:42:40) Components 
      ⌨️ (0:46:01) Reviewing what we have learnt so far 
      ⌨️ (0:48:52) Creating the upcoming weather component 
      ⌨️ (0:52:17) Introducing lists 
      ⌨️ (1:19:17) Implementing our list 
      ⌨️ (1:09:10) Key extractors
      ⌨️ (1:11:41) Other FlatList props
      ⌨️ (1:15:01) Styling our FlatList
      ⌨️ (1:19:23) Images
      ⌨️ (1:22:31) Using an image in the upcoming weather component
      ⌨️ (1:24:10) ImageBackground
      ⌨️ (1:26:05) Props
      ⌨️ (1:35:17) Refactoring what we have done so far
      ⌨️ (1:43:04) Implementing the city screen
      ⌨️ (2:00:17) Refactoring the city screen
      ⌨️ (2:15:32) Refactoring the current weather screen
      ⌨️ (2:26:25) Introducing Navigation
      ⌨️ (2:34:37) Implementing tabs in our app
      ⌨️ (2:40:02) Styling our tabs
      ⌨️ (2:47:27) Extracting the tabs
      ⌨️ (3:06:55) State
      ⌨️ (3:15:07) The useState hook
      ⌨️ (3:19:24) Hooks
      ⌨️ (3:23:24) The useEffect hook
      ⌨️ (3:32:05) Adding a loading state
      ⌨️ (3:38:31) Using the open weather map api
      ⌨️ (3:39:31) Getting the users location
      ⌨️ (3:47:36) Setting up fetching the api data
      ⌨️ (3:52:38) Fetching the Api data
      ⌨️ (4:01:17) Making our own hook
      ⌨️ (4:05:17) Passing the data to our components
      ⌨️ (4:08:42) Updating current weather to use the data
      ⌨️ (4:14:32) Updating the upcoming weather to use the data
      ⌨️ (4:18:17) Installing Moment
      ⌨️ (4:21:17) Updating the city component
      ⌨️ (4:25:53) Creating the error screen
      ⌨️ (4:31:42) Some last refactoring
      ⌨️ (4:33:59) Bonus material`,
      description: 'Master React Native with this comprehensive course, covering everything from the basics of setup and components to advanced topics like navigation and fetching API data.',
    },
    {
        image: nodeJs,
      title: 'Learn Node.js - Full Tutorial for Beginners',
      whatyoulearn: `\u00A0\u00A0\u00A0\u00A0
      ⌨️ (0:00:00) Installing Nodejs
      ⌨️ (0:05:22) Working With Modules
      ⌨️ (0:14:40) The Events Module and EventEmitter Class
      ⌨️ (0:22:32) Working With The ReadLine Module.
      ⌨️ (0:34:36) Working With File System Module (Creating,Reading,Deleting,Renaming) Files
      ⌨️ (0:45:04) Working With File System Module. Creating and Deleting Folders
      ⌨️ (0:57:36) Working with Readable and Writable Streams
      ⌨️ (1:02:40) Why you should use Streams
      ⌨️ (1:05:41) Pipes and Pipe Chaining. (Readable,Writable and Transform Streams)
      ⌨️ (1:12:36) Creating a Http Server using the Http Module
      ⌨️ (1:17:52) Serving Static Files with Http and File System Module (html,json,image)
      ⌨️ (1:24:30) Create our Package.json using Npm Init
      ⌨️ (1:27:18) Installing Packages using Npm (Node Package Manager)
      ⌨️ (1:32:23) Semantic Versioning
      ⌨️ (1:36:42) Getting started with Express Web Framework
      ⌨️ (1:40:48) Working with Express Http Get Request, Route Params and Query Strings
      ⌨️ (1:49:52) Serving Static Files with Express
      ⌨️ (1:54:36) Http Post Request with Express and Body Parser Module
      ⌨️ (2:00:17) Working with JSON Data with Express and the Body Parser Module
      ⌨️ (2:07:40) User Input Validation With Express And JOI
      ⌨️ (2:15:24) User Input Validation with JOI Validating Nested Object and Arrays
      ⌨️ (2:22:34) Getting Started With EJS Templates With Express
      ⌨️ (2:35:22) How does MiddleWare Work and Creating Custom Middleware
      ⌨️ (2:42:49) Working With The Express Router`, 
      description:`Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser.`
    },
    {
        title:'Flutter Course for Beginners',
        description:'Learn how to use Flutter in this complete course for beginners. Flutter is an open-source UI software development kit used to create cross-platform applications for iOS, Android, Windows, Mac, and more. ',
        image:flutter,
        whatyoulearn:`⌨️ (00:00:00) Introduction
        ⌨️ (00:02:57) Developer Accounts
        ⌨️ (00:39:12) Setup
        ⌨️ (01:14:42) Introduction to Dart
        ⌨️ (02:01:26) Dart Control Statements and Collections
        ⌨️ (02:46:44) Sound Null safety in Dart
        ⌨️ (03:27:12) Dart Enumerations, Classes and Objects
        ⌨️ (04:18:36) Advanced Dart
        ⌨️ (05:00:41) Project Setup
        ⌨️ (05:48:30) iOS App Setup
        ⌨️ (06:59:32) Android App Setup
        ⌨️ (07:31:31) Firebase Backend Setup
        ⌨️ (08:01:20) Basic Registration Screen
        ⌨️ (09:04:54) Login View
        ⌨️ (09:53:10) Separating App Initialization from Login and Register Screens
        ⌨️ (10:19:47) Setting up Git and GitHub
        ⌨️ (11:10:34) Email Verification View
        ⌨️ (11:44:45) Link Between Login and Register Views
        ⌨️ (12:18:01) Logout View
        ⌨️ (13:13:46) Go From Login to Notes View
        ⌨️ (13:36:43) Cleaning Up our Routes
        ⌨️ (13:51:17) Error Handling in Login View
        ⌨️ (14:16:21) Error Handling in Register View, Next Screen After Registration
        ⌨️ (14:44:45) Confirming Identity Before Going to Main UI
        ⌨️ (14:52:21) Auth Service
        ⌨️ (15:55:22) Migrating to Auth Service
        ⌨️ (16:33:41) Unit Testing our AuthService
        ⌨️ (17:43:42) CRUD Local Storage
        ⌨️ (19:30:57) Working with Streams in Notes Service
        ⌨️ (20:04:32) Preparing Notes View to Read All Notes
        ⌨️ (20:39:21) Preparing to Create New Notes
        ⌨️ (21:00:16) Creating New Notes
        ⌨️ (21:35:42) Displaying Notes in Notes View
        ⌨️ (21:56:04) Deleting Existing Notes in Notes View
        ⌨️ (22:40:46) Updating Existing Notes
        ⌨️ (23:14:12) Protecting NotesService with Current User
        ⌨️ (23:40:44) Writing Notes to Cloud Firestore
        ⌨️ (24:58:08) Migrating to our Firestore Service
        ⌨️ (25:22:35) Sharing Notes
        ⌨️ (25:37:43) Introduction to Bloc
        ⌨️ (26:24:31) Converting our Auth Process to Bloc
        ⌨️ (27:31:17) Handling Auth Bloc Exceptions During Login
        ⌨️ (28:52:45) Moving to Bloc for Routing and Dialogs
        ⌨️ (28:58:23) Loading Screens
        ⌨️ (29:48:31) Final Touches Before App Release
        ⌨️ (30:43:03) App Icons and App Name
        ⌨️ (31:06:34) Splash Screen
        ⌨️ (31:56:58) Sending our iOS app to App Store Connect
        ⌨️ (32:55:44) Releasing our iOS App
        ⌨️ (33:20:31) Fixing Firebase Security Rules and Resubmitting the iOS App
        ⌨️ (33:50:07) Releasing our Android App
        ⌨️ (34:55:19) Localization in Flutter
        ⌨️ (36:33:57) Outro`,
    },
    
];

export default courses;
