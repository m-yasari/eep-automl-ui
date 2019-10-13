# EEP Auto ML

### Pre Installation

Before \starting the application, install the NodeJS v8+, then install node packages by following command:

```
npm install
```

### Development

To compile the client for development run

```
npm run dev:start
```

### View the application
To browse the application and view the first page, open below URL in your browser

```
http://localhost:9000/
```

The following URLs can be used for stub data:

Train: http://localhost:9000/stub/data/Titanic/train.csv
Test: http://localhost:9000/stub/data/Titanic/test.csv


### Production Build
To compile and build the client and server run

```
npm run build
```
The output package will be created in 'dist' folder.
To start the the build production UI, run the following on 'dist' folder:
```
npm start
```
or
```
node start
```
