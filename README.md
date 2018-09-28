* Prerequisites : Install [Docker](https://www.docker.com/get-started)
* This project use [nginx-proxy/jwilder](https://github.com/jwilder/nginx-proxy)

# Prepare your environment

* First, need to create docker network for proxy
```
docker network create wp-dev-env
```

* Go in your nginx_sql folder
```
cd nginx-sql
```

* Rename .env.sample in .env & declare your ENV variables

* Add phpMyAdmin host in /etc/hosts
```
echo '127.0.0.1 phpmyadmin.sql' | sudo tee -a /etc/hosts
```

* Start Nginx and SQL containers
```
cd nginx-sql
docker-compose up -d
```


# Run your Wordpress install

* Go in your project folder
```
cd example.com
```

* Rename .env.sample in .env & declare your ENV variables

* Compose your setup
```
docker-compose up -d
```

* Good to know
```
// Stop all running containers
docker stop $(docker ps -q)

// Remove all containers
docker rm $(docker ps -a -q)
```

* Info : Click accept on the warning about self-signed certs on browser :)

* Access on **https://example.com for live version**

* Access on **http://dev.example.com for dev version with BrowserSync**
* (You have to wait few minutes to access to this url until NPM finish to install all dependencies)
* --> NO HTTPS ON DEV MODE



# My Theme (with Bootstrap 4.0) in /www/wp-content/themes/my-theme
* Adding new CSS file
```
// Create your file in src/css
// + in app.css
@import 'yourfile.css'
```

* Adding new JS file
Create your file in src/js.
Webpack bundles all files in one


# Add WP website (without Theme development config)
* Copy docker-compose.yml & .env.sample in your project folder
* Delete Node block in docker-compose.yml
* Rename .env.sample in .env, declare your ENV variables & comment WORDPRESS_THEME_NAME
* Add your vhost in /etc/hosts
