{{{ "title" : "Connecting to Foursquare with iOS", "tags" : ["foursquare", "api", "iOS", "objective c" ], "category" : "ios", "date" : "4-23-2013", "author": "Keith Elliott" }}}

Recently, I had the need to connect to Foursquare API for an app that I was working on.  Foursquare uses OAuth 2.0, which is the standard that most API providers has migrated to.   Therefore, In this tutorial, I will show you how to handle OAuth in an iOS application.  We will be referencing foursquare’s document located [here](https://developer.foursquare.com/overview/auth) from time to time during this tutorial.

###Foursquare Api setup

The first thing you need to do is register your app in order to get foursquare API credentials.  You can go to this link to register your app.  Access tokens allow your app to make requests on behalf of a user.  Foursquare provides to access routes to connect to its api via code or token.  For iOS apps, the preferred method is to go the token route.

The token access flow works by redirecting your user to an authentication page using the following format:

		https://foursquare.com/oauth2/authenticate
			?client_id=CLIENT_ID
			&response_type=token
			&redirect_uri=YOUR_REGISTERED_REDIRECT_URI

If the user accepts, the user is redirected to a callback url with an access token.  In our app, we will need to intercept and store the access token for future requests against the api.  The redirected response will have this format:

		http://YOUR_REGISTERED_REDIRECT_URI/#access_token=ACCESS_TOKEN

Notice that we will have to replace *CLIENT_ID* with the client id that our app is assigned and the *YOUR_REGISTERED_REDIRECT_URI* with the callback we registered when creating our app.  Creating the app on foursquare is pretty straightforward.  So, I will let you refer to the documentation on that and just talk through the tricky parts that you have to deal with in your code.

###iOS App

Now for the fun stuff.  I believe in having a clear separation of responsibilities when developing apps.  Basically, it would be great if we could create a generic class to handle the foursquare authentication for us and then give control back to our app.  We still need an app to test our application so go ahead and fire up Xcode and create a single view application using the template.  I chose to use storyboards, but it doesn’t really matter for this example.  We next need to create a new class to handle our authentication work.  Create a new class and name it FoursquareAuthentication and have it inherit from UIViewController.  Our class is going to make a call to foursquare, display a webpage for users to put in their credentials, and then receive a callback that contains the access token.  In order to make that work, we will need to add a webview and handle the interactions using a delegate.  This means we need to add *UIWebviewDelegate* protocol to our class and implement a couple of methods.  Your header should look like this:

		@interface FoursquareAuthentication : UIViewController<UIWebViewDelegate>

		@end

Now switch over to the implementation file.  The first thing I did was add an *UIWebView* property to the anonymous category.  Next, we initialize our webview and add it to our view in our *-viewDidLoad* method.  We also have to set the webview’s delegate to *self* so that we can handle and respond to the network requests we intend to make. Finally, we create and make a request to foursquare’s authenticate endpoint.  See below for the code I used to make all this happen.

		#import "FoursquareAuthentication.h"

		  // 5. setup some helpers so we don't have to hard-code everything

		#define FOURSQUARE_AUTHENTICATE_URL @"https://foursquare.com/oauth2/authorize"

		#define FOURSQUARE_CLIENT_ID @"YOUR CLIENT ID"

		#define FOURSQUARE_CLIENT_SECRET @"YOUR CLIENT SECRET"

		#define FOURSQUARE_REDIRECT_URI @"ios-app://redirect"

		@interface FoursquareAuthentication ()

			// 1. create webview property

		@property (nonatomic, strong) UIWebView *webView;

		@end

		@implementation FoursquareAuthentication

		- (void)viewDidLoad

		{

			[super viewDidLoad];

			// Do any additional setup after loading the view.

				// initialize the webview and add it to the view

				//2. init with the available window dimensions

			self.webView = [[UIWebView alloc] initWithFrame:CGRectMake(0, 0, 320, 460)];

				//3. set the delegate to self so that we can respond to web activity

			self.webView.delegate = self;

				//4. add the webview to the view

			[self.view addSubview:self.webView];

				//6. Create the authenticate string that we will use in our request to foursquare

				// we have to provide our client id and the same redirect uri that we used in setting up our app

				// The redirect uri can be any scheme we want it to be... it's not actually going anywhere as we plan to

				// intercept it and get the access token off of it

			NSString *authenticateURLString = [NSString stringWithFormat:@"%@?client_id=%@&response_type=token&redirect_uri=%@", FOURSQUARE_AUTHENTICATE_URL, FOURSQUARE_CLIENT_ID, FOURSQUARE_REDIRECT_URI];

				//7. Make the request and load it into the webview

		  NSURLRequest *request = [NSURLRequest requestWithURL:[NSURL URLWithString:authenticateURLString]];

			[self.webView loadRequest:request];

		}


Next we need to handle one of the webview’s delegate methods:

		-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType

We will use the *webview:shouldStartLoadWithRequest:navigationType* to check for our callback url and intercept.  We will allow all other requests to pass through.  I’m using the custom scheme *ios-app://* as the base of my callback url.  This is the most confusing part of the process.  We want the authentication request to foursquare to load the webpage in our webview.  However, we want the redirect callback to be intercepted so that we can read off the access token and store it.  Hence, why we use the custom url.  We will store the access token in user defaults for future requests.

		#pragma mark - Web view delegate

		- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {

		 if([request.URL.scheme isEqualToString:@"ios-app"]){

			 // 8. get the url and check for the access token in the callback url

				NSString *URLString = [[request URL] absoluteString];

				if ([URLString rangeOfString:@"access_token="].location != NSNotFound) {

						// 9. Store the access token in the user defaults

					NSString *accessToken = [[URLString componentsSeparatedByString:@"="] lastObject];

					NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

					[defaults setObject:accessToken forKey:@"access_token"];

					[defaults synchronize];

						// 10. dismiss the view controller

					[self dismissViewControllerAnimated:YES completion:nil];

				}

			}

			return YES;

		}


###Testing our Work

To test the app, we will add a button to our viewcontroller to initiate our authentication to foursquare.  In our view did load method we check to see if we have an access token.  If not, we display our foursquare button so that our user can connect to foursquare and authorize our app.  We also add an action button to launch our authentication controller facilitate getting us an access token from our user.

		- (void)viewDidLoad

		{

			[super viewDidLoad];

			// Do any additional setup after loading the view, typically from a nib.

				//check for foursquare and authorize

			NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];

			if(![defaults objectForKey:@"access_token"]){

				[self.connectToFoursquare setHidden:NO];

			}

			else{

				[self.connectToFoursquare setHidden:YES];

			}

		}

		- (IBAction)connect:(id)sender {

			FoursquareAuthentication *controller = [[FoursquareAuthentication alloc] init];

			[self presentViewController:controller animated:NO completion:nil];

			[self.connectToFoursquare setHidden:YES];

		}

That’s it.  I have included a sample project on [github](https://github.com/keithelliott/foursquaredemo) that has the entire project.  Enjoy!

