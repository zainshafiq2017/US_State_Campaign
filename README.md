# US Presidential Election
 - Graphics representations of school donations

## TABLE OF CONTENT
   - Introduction
   - Project Structure
   - Project source
   - Donation graphs
   - Project Overview
   - Database
   - Usage
   - Description pages
   - Description graphs and calculation groups number display
   - TECHNOLOGY USED

## INTRODUCTION
This project creates a webapp that will let users and potential voters to explore and view interactive data about school donations. The visualization of data
are in different type of charts. I've downloaded the data from DonorsChoose.org that is an organisation where the funds are collected based on publication of projects by teachers.
I've used MongoDB for storing data, Python for building a web server that interacts with MongoDB and serves HTML pages, dc, d3 and crossfilter.

## PROJECT STRUCTURE
![screenshot 4](static/images/readme4.jpg?raw=true "screenshot 4")

## PROJECT SOURCE
Project source can be download from the following link:
https://github.com/zainshafiq2017/US_State_Campaign.git

## DONATIONS GRAPHS  (SCREENSHOT)
![screenshot 1](static/images/readme1.jpg?raw=true "screenshot 1")
![screenshot 2](static/images/readme2.jpg?raw=true "screenshot 2")
![screenshot 3](static/images/readme3.jpg?raw=true "screenshot 3")

## PROJECT OVERVIEW
### WHAT PROBLEM THIS WEBSITE SOLVE?
To win the US electoral campaign, we need to display a webapp that shows the status of funds donated to school projects through graphs.

### PROJECT OBJECTIVE
The goal of this project is to use javascript libraries like dc, d3, crossfilter and MongoDB to create interactive data visualization.

### HOW DOES IT WORK
This site uses different technologies to give the final result. You can see underneath on TECHNOLOGY USED section to find references of guides to learn these technologies.
I deployed my web app on Heroku but through the connection I point data that are on MongoDB (mLab).

## DATABASE
I fetched the data first from DonorsChoose.org and imported to MongoDB that is an open source document-oriented database system. MongoDB stores structured data as json. I migrated
data to [mLab](https://mlab.com/) that is a database as a service for MongoDB. The procedure of how to migrate data into mLab is in the following link:
http://docs.mlab.com/migrating/

## USAGE
### QUICK START
Open your command line and use:
git clone https://github.com/zainshafiq2017/US_State_Campaign.git
cd US_State_Campaign
virtualenv env
source env/bin/activate
Install the dependencies:
```cmd
pip install -r requirements.txt.
```

Run the development server:
```cmd
python app.py
```

Open your browser and navigate to http://127.0.0.1:5000

To import data to MongoDB is the following command:
mongoimport -d donorsUSA -c projects --type csv --file opendata_projects_clean.csv --headerline

### DEPLOYING TO HEROKU
 - Signup for Heroku
 - Login to Heroku and download the Heroku Toolbelt
 - Once installed, open command line and run the following command `heroku login` and follow prompts.
 - Activate your virtualenv
 - All dependencies have to be added to a requirements.txt with `pip freeze > requirements.txt` command.
 - Create a -procfile with editor and save it with the following text `web: gunicorn donations_Nebraska:app` that tells what to do with application once it's been deployed
 - Create a local Git repository:
   ```cmd
   git init
   git add .
   git commit -m "initial files"
   ```
 - Create your app on Heroku:
   `heroku create <git-url-for-your-app>`
 - Deploy your code to Heroku:
   `git push heroku master`
 - View your app on browser:
   `heroku open`

## Description pages
**donation_Nebraska.py**
 - In this page I've imported flask(web framework), pymongo module for mongoDB to use, json to convert DB in json format.
   Added `routes` to bind a URL to a specfic HTML page using function render_templates, and to connect our MongoDB to extract data in json format.
   At the end I run the app on a local machine.

**index.html**
 - In this page I've added all references to our libraries such as bootstrap,crossfilter,dc,d3,keen,queue and css.
   This page contains:
    - navigation bar
    - div for bind dashboard charts
    - table to show collections related to graphs

**about.html**
 - This page is for campaign advertising to influence the voters to vote us.

**graph.js**
 - queue function is use to asynchronous loading.
 - Added helper function and messages to show errors if there is something wrong.
 - Transform data using d3 functions i.e. change date type from string to datetime object and with +d convert variables to a numbers.
 - Create a crossfilter instance
 - Defined dimensions, groups and range.
 - With `dc.renderAll()` we can finally display numbers and charts

## Description of graphs and total counted data
 - At top of the pages I'm displaying:
   - Total number of donations: This number is obtained by grouping all value in .group function
   - Number of donors: This is sum of our column "num_donors" using reduceSum function.
   - Total donations in USD: This is sum of our column "total_donations" using reduceSum function.
   - Number of students reached: This is sum of our column "students_reached" using reduceSum function.
   - Donation states: This is the selection menu to display American states.
 - Charts
   - Prices excluding optional support: This line chart show price excluding optional support disaggregated by ranges: >0<300$ >=300$<600$ and >=600$.
     I used "date_posted" for x values and for y values the total of num_donor based on range prices(total_price_excluding_optional_support).
     In this chart we can see also legend and title informations.
   - Funding status: This pie chart shows the funding status of donations. To get this result I used "funding status" field for 
     dimension and group functions.
   - Poverty level: In this row chart we can see poverty level. I used "poverty_level" field to extract data and visualized in the
     row chart.
   - Donation by teacher prefix: It's a pie chart where I've used "teacher_prefix" field for dimension and group functions. 
   - Donations by month: In this bar chart we can see for every month the total donation in USD. For dimension(x-values) I used 
     "d.month" and for y values I've grouped using reducesum function for "total_donations" field.
   - Secondary focus area: Another pie chart where for dimension and group I use "secondary_focus_area" field to see donations for
     every secondary area.
   - Donations by primary focus area: In this row chart we can see donations for every primary focus area.
     I used crossfilter function called dimension and group using field "primary_focus_area".
 - At the end of the page I've added also tables that are interact with other graphs. The tables show the following fields: `funding_status, school_state, resource_type, poverty_level, total_price_excluding_optional_support, num_donors`
   To create it I've just created div including styling with giving id that we need for dc reference. In graph.js the data table has been implemented.

## TECHNOLOGY USED
[Bootstrap](https://getbootstrap.com/docs/4.0/getting-started/introduction/)
[crossfilter](http://square.github.io/crossfilter/)
A javascript based data manipulation library. Works splendid with dc.js. Enables two way data binding.
[DC](https://dc-js.github.io/dc.js/)
A javascript based wrapper library for D3.js which makes plotting the charts a lot easier.
[D3](https://github.com/d3/d3/wiki)
A javascript based visualization engine which will render interactive charts and graphs based on the data.
MongoDB
The resident No-SQL database which will serve as a fantastic data repository for our project.
keen.min.js
jquery
queue
python
javascript
HTML
CSS
