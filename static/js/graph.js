queue()
    .defer(d3.json, "/donorsUS/projects")
    .await(makeGraphs);

function makeGraphs(error, donorsUSProjects) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }
    // Helper function
    function print_filter(filter){
        var f = eval(filter);
        if (typeof(f.length) != "undefined") {}else{}
        if (typeof(f.top) != "undefined") {f=f.top(Infinity);}else{}
        if (typeof(f.dimension) != "undefined") {f=f.dimension(function(d) { return "";}).top(Infinity);}else{}
        console.log(filter+"("+f.length+") = "+JSON.stringify(f).replace("[","[\n\t").replace(/}\,/g,"},\n\t").replace("]","\n]"));
    }
    //console.log(donorsUSProjects);


    //Clean donorsUSProjects data
    var dateFormat = d3.time.format("%Y-%m-%d %H:%M:%S");
    donorsUSProjects.forEach(function (d) {
        d["date_posted"] = dateFormat.parse(d["date_posted"]);
        d["date_posted"].setDate(1);
        d["total_donations"] = +d["total_donations"];
        d["num_donors"] = +d["num_donors"];
        d["students_reached"] = +d["students_reached"];
        d["total_price_excluding_optional_support"] = +d["total_price_excluding_optional_support"];
        d.month = d["date_posted"].getMonth()+1;
        //For Tables
        d.year = d.date_posted.getFullYear();
        d["funding_status"] = d["funding_status"];
        d["school_state"] = d["school_state"];
        d["resource_type"] = d["resource_type"];
        d["poverty_level"] = d["poverty_level"];
    });


    //Create a Crossfilter instance
    var ndx = crossfilter(donorsUSProjects);

    //Define Dimensions
    var dateDim = ndx.dimension(function (d) {
        return d["date_posted"];
    });
    var resourceTypeDim = ndx.dimension(function (d) {
        return d["resource_type"];
    });
    var povertyLevelDim = ndx.dimension(function (d) {
        return d["poverty_level"];
    });
    var primaryFocusAreaDim = ndx.dimension(function (d) {
        return d["primary_focus_area"];
    });
    var stateDim = ndx.dimension(function (d) {
        return d["school_state"];
    });
    var fundingStatus = ndx.dimension(function (d) {
        return d["funding_status"];
    });
    var teacherPrefix = ndx.dimension(function (d) {
        return d["teacher_prefix"];
    });
    var secondaryFocusArea = ndx.dimension(function (d) {
        return d["secondary_focus_area"];
    });
    var PriceExcludingOptional = ndx.dimension(function (d) {
        return d["total_price_excluding_optional_support"];
    });
    var monthDim = ndx.dimension(function (d) {
        return +d.month;
    });



    //Calculate metrics
    var numProjectsByDate = dateDim.group();
    var numProjectsByResourceType = resourceTypeDim.group();
    var numProjectsByPovertyLevel = povertyLevelDim.group();
    var numProjectsByPrimaryFocusArea = primaryFocusAreaDim.group();
    var numProjectsByFundingStatus = fundingStatus.group();
    var numProjectsByPrefixTeacher = teacherPrefix.group();
    var numProjectsBySecondaryFocusArea = secondaryFocusArea.group();
    var totalDonationsByState = stateDim.group().reduceSum(function (d) {
        return d["total_donations"];
    });
    var numProjectstotalPriceExcludingOptional1 = dateDim.group().reduceSum(function (d) {
        if (d.total_price_excluding_optional_support > 0 && d.total_price_excluding_optional_support < 300){
            return d.num_donors;
        }
        else{
            return 0;
        }
    });
    var numProjectstotalPriceExcludingOptional2 = dateDim.group().reduceSum(function (d) {
        if (d.total_price_excluding_optional_support >= 300 && d.total_price_excluding_optional_support < 600){
            return d.num_donors;
        }
        else{
            return 0;
        }
    });
    var numProjectstotalPriceExcludingOptional3 = dateDim.group().reduceSum(function (d) {
        if (d.total_price_excluding_optional_support >= 600){
            return d.num_donors;
        }
        else{
            return 0;
        }
    });
    var totalDonationsByMonth = monthDim.group().reduceSum(function (d) {
        return d.total_donations;
    });

    var stateGroup = stateDim.group();
    var all = ndx.groupAll();
    var totalDonations = ndx.groupAll().reduceSum(function (d) {
        return d["total_donations"];
    });
    var numdonors = ndx.groupAll().reduceSum(function (d) {
        return d["num_donors"];
    });
    var studentsReached = ndx.groupAll().reduceSum(function (d) {
        return d["students_reached"];
    });

    //Define values (to be used in charts)
    var minDate = dateDim.bottom(1)[0]["date_posted"];
    var maxDate = dateDim.top(1)[0]["date_posted"];

    //Charts
    //var timeChart = dc.lineChart("#time-chart");
    var totalPriceExcludingOptionalChart = dc.lineChart("#prices-excluding-optional-support-nd");
    var resourceTypeChart = dc.rowChart("#resource-type-row-chart");
    var povertyLevelChart = dc.rowChart("#poverty-level-row-chart");
    var primaryFocusAreaChart = dc.rowChart("#primary-focus-area-row-chart");
    var numberProjectsND = dc.numberDisplay("#number-projects-nd");
    var totalDonationsND = dc.numberDisplay("#total-donations-nd");
    var totalnumDonorsND = dc.numberDisplay("#num-donors-nd");
    var totalstudentsReachedND = dc.numberDisplay("#total-students-reached-nd");
    var fundingStatusChart = dc.pieChart("#funding-chart");
    var teacherPrefixChart = dc.pieChart("#teacher-prefix-chart");
    var secondaryFocusAreaChart = dc.pieChart("#secondary-focus-area-chart");
    var selectField = dc.selectMenu('#menu-select');
    var donationsMonthBarChart = dc.barChart("#donations-by-month-bar-chart");

    var numberFormat = d3.format(",");


    selectField
        .dimension(stateDim)
        .group(stateGroup);

    numberProjectsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(all);

    totalDonationsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(totalDonations)
        .formatNumber(d3.format(".3s"));

    totalnumDonorsND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(numdonors);

    totalstudentsReachedND
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(studentsReached)
        .formatNumber(d3.format(".3s"));


    // This chart shows price excluding optional support
    totalPriceExcludingOptionalChart
        //.ordinalColors(["#66AFB2"])
        .width(1200)
        .height(300)
        .margins({top: 30, right: 50, bottom: 30, left: 50})
        .mouseZoomable(false)
        .renderArea(true)
        .dimension(dateDim)
        .group(numProjectstotalPriceExcludingOptional1, "Price excluding optional support lower than $300")
        .stack(numProjectstotalPriceExcludingOptional2,"Price excluding optional support between $300 and $600")
        .stack(numProjectstotalPriceExcludingOptional3,"Price excluding optional support higher than $600")
        .legend(dc.legend().x(90).y(20).itemHeight(13).gap(5))
        .brushOn(false)
        .transitionDuration(500)
        .x(d3.time.scale().domain([minDate, maxDate]))
        .xAxisLabel("Year")
        .yAxisLabel("Donations")
        .elasticY(true)
        .elasticX(false)
        .title(function (d) {
                        var value = d.value;
                        if (isNaN(value)) value = 0;
                           return dateFormat(d.key) + "\n" + numberFormat(d.value) + " donations";})
        .renderTitle(true);

    resourceTypeChart
        //.ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(300)
        .height(250)
        .dimension(resourceTypeDim)
        .group(numProjectsByResourceType)
        .xAxis().ticks(4);

    povertyLevelChart
        //.ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(300)
        .height(250)
        .dimension(povertyLevelDim)
        .group(numProjectsByPovertyLevel)
        .xAxis().ticks(4);

    primaryFocusAreaChart
        //.ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .width(300)
        .height(250)
        .dimension(primaryFocusAreaDim)
        .group(numProjectsByPrimaryFocusArea)
        .xAxis().ticks(6);

    fundingStatusChart
        //.ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#D3D1C5", "#F5821F"])
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(fundingStatus)
        .group(numProjectsByFundingStatus);

    teacherPrefixChart
        //.ordinalColors(["#79CED7", "#66AFB2", "#C96A23", "#de2cce", "#F5821F"])
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(teacherPrefix)
        .group(numProjectsByPrefixTeacher);

    secondaryFocusAreaChart
        //.ordinalColors(["#dbde2c", "#66AFB2", "#C96A23", "#D3D1C5", "#df4524"])
        .height(220)
        .radius(90)
        .innerRadius(40)
        .transitionDuration(1500)
        .dimension(secondaryFocusArea)
        .group(numProjectsBySecondaryFocusArea);

    donationsMonthBarChart
        .width(650)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 70})
        .dimension(monthDim)
        .group(totalDonationsByMonth)
        .transitionDuration(500)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .xAxisLabel("Month")
        .yAxisLabel("Donations in USD")
        .title(function(d) { return "Month: " + d.key + "\n" +"$" + numberFormat(d.value); })
        .renderTitle(true)
        .yAxis().ticks(5);

    //Table
    var datatable = dc.dataTable("#dc-data-table");
    datatable
       .dimension(dateDim)
       .group(function (d) {
           return d.year;
       })
        .size(30)
       // create the columns dynamically
       .columns([
           function (d) {
               return d.funding_status;
           },
           function (d) {
               return d.school_state;
           },
           function (d) {
               return d.resource_type;
           },
           function (d) {
               return d.poverty_level;
           },
           function (d) {
               return d.total_price_excluding_optional_support;
           },
           function (d) {
               return d.num_donors;
           },
       ]);

    dc.renderAll();
}