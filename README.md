# Dissident Booster Website

* Prerequisites : Install [Docker](https://www.docker.com/get-started)
* This project use [nginx-proxy/jwilder](https://github.com/jwilder/nginx-proxy)

* First, need to create docker network for proxy
```
docker network create nginx-proxy
```

* Start Nginx proxy
```
cd nginx-proxy
docker-compose up -d
```

* Add hosts in /etc/hosts (Wordpress, phpMyAdmin, dev server)
```
echo '127.0.0.1 example.com pma.example.com dev.example.com' | sudo tee -a /etc/hosts
```

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

* Info : Click accept on the warning about self-signed certs :)

* Access on **https://example.com for live version**
```
login: your-login
pass: your-password
```

* Access on **https://pma.example.com for phpMyAdmin**


* Access on **http://dev.example.com for dev version with BrowserSync**
* --> NO HTTPS ON DEV MODE
* (You have to wait few minutes to access to this url until NPM finish to install all dependencies)


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


# Add WP website (without Theme development config: Gulp, BrowserSync, Webpack)
* Copy docker-compose.yml & .env.sample in your project folder
* Delete Node block in docker-compose.yml and change volume name of db (ex: database3)
* Rename .env.sample in .env, declare your ENV variables & comment WORDPRESS_THEME_NAME
* Add hosts in /etc/hosts (Wordpress: host.domain, phpMyAdmin: pma.host.domain)
