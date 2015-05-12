# team-c-api
API Repo

The API is a node server using express routes. The routes/index.js handles dynamically added routes so as to not have to
explicitly handle every route.

localhost:50001/helloworld - references rotes/helloworld
localhost:50001/foo/bar/baz - would reference foo if foo.js was top level in routes and give it arguments bar and baz
                            - would reference bar if the folder structure was /routes/foo/bar.js and give it argument baz
                            - would reference baz if the folder structure was /routes/foo/bar/baz.js and give it no arguments.
                            
Route js files need only return a function that takes in 2 arguments
- the first argument, usually called req, contains the request object. req.params would contains any parameters passed to the route
- the second argument, usually called res, contains the result functions that allow you to pass result information back to the calling app

