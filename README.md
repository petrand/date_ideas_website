# date_ideas_website
This website http://dateideagenerators.com/ allows users to select a category and it will randomly pick a date idea from the database. Anyone can submit an idea and hopefully as number of users increases, more and more creative ideas are added to the db.
If you are trying to access the website and its not available, its likely I stopped paying form the VPS and the domain. 

The website and the server are created in a fully dockerised environment and are hosted on a cloud VPS. NGINX is used for reversed proxy and redirecting traffic to correct container ports. 
The inputted date ideas are cleaned up and loaded into the mongoDB cloud. 

The primary purpose of the website was for me to experiment with docker, node, nginx and vsp technologies as well as make going on dates with my partner easier! 
