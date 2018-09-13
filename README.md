# Dissident Booster Website
* Install **[Git Large File Storage (LFS)](https://git-lfs.github.com/)**
```
git lfs install
```
* Pull
```
docker-compose up -d
```
* Access on **localhost:8000**
```
login: wpdsd
pass: f9eCgBJge5iTBhPs
```

* Access Dev Env on **localhost:3000**
```
docker exec -it dsd-dev /bin/bash
// quit container without terminating it
// with ctrl+p + crtl+q

// inside container
npm run dev
```

* Adding new CSS file
```
// Create your file in src/css
// + in app.css
@import 'yourfile.css'
```

* Adding new JS file
Create your file in src/js.
Webpack bundles all files in one
