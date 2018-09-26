# Dissident Booster Website

* Pull
```
docker-compose up -d
```

* Stop all running containers
```
docker stop $(docker ps -q)
```

* Add line below to your /etc/hosts file
```
127.0.0.1       dissidentbooster.fr
```

* Access on **http://dissidentbooster.fr(:80) for live version**
```
login: wpdsd
pass: f9eCgBJge5iTBhPs
```

* Access on **http://dissidentbooster.fr:3000 for dev version**
* (You have to wait few minutes to access to this url until NPM finish to install all dependencies)


* Access on **http://dissidentbooster.fr:7000 for phpMyAdmin**


* Adding new CSS file
```
// Create your file in src/css
// + in app.css
@import 'yourfile.css'
```

* Adding new JS file
Create your file in src/js.
Webpack bundles all files in one
