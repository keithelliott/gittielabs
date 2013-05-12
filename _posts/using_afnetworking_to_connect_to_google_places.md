{{{ "title" : "Connecting to Google Places Using AFNetworking", "tags" : ["AFNetworking","Google Places", "api", "iOS", "objective c" ], "category" : "ios", "date" : "5-6-2013", "author": "Keith Elliott" }}}

Today, I want to talk about connecting to an REST based api with iOS.  There are lots of ways to accomplish this but we will use AFNetworking as our framework of choice.  AFNetworking is a great framework created by Matt Thompson [@mattt](https://twitter.com/mattt) and Scott Raymond [@sco](https://twitter.com/sco) that I use often when I want an abstraction layer on top of Apple's networking library.  AFNetworking is built on top of NSURLConnection and NSOperation.  It's very easy to use and has a large community of developers that use and contribute to the project.  You can read the documention and grab a copy of the code from [github](https://github.com/AFNetworking/AFNetworking)

###Getting Started
Let's cover the startup quick.  Because the documentation is excellent, we should be able to breeze through and be up and running in no time.  You need to have Xcode 4.2 or later and a target applicaiton of iOS 5 or Mac 10.7 and later. You should be able to follow the [Getting Started with AFNetworking](https://github.com/AFNetworking/AFNetworking/wiki/Getting-Started-with-AFNetworking) to handle setting up AFNetworking for a project.

####Step 1. Download AFNetworking
Head to github and get the source code from the [AFNetworking repository]((https://github.com/AFNetworking/AFNetworking).

####Step 2. Add AFNetworking to your project
