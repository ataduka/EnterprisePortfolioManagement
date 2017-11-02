var pieChart = dc.pieChart("#chart1");
//var barChart = dc.barChart("#chart2");
var pieChart2 = dc.pieChart("#chart3");
var tcoeBarChart1 = dc.barChart("#chart4");
var tcoeBarChart2 = dc.barChart("#chart5");
var tcoeLineChart = dc.lineChart("#chart6");
var dataGrid = dc.dataTable("#dc-table-graph");
var categoryChart = dc.rowChart("#chart0");
//var categoryChart12 = dc.rowChart("#chart12"); 
var color = d3.scale.ordinal()
    .range(["#ee4035", "#f37736", "#ead61c", "#88d8b0", "#7bc043"]);
//var keyprojectsChart = dc.bulletChart('#bullet-horizontal');
var ndx;
var alldata;
var countryDim

//CrossFilter Code begins
d3.csv("test1.csv", function(error, experiments) {

  /*experiments.forEach(function(d){
    d.CTA = parseInt(d.CTA);
  })*/

	ndx = crossfilter(experiments),
      pl1Dim  = ndx.dimension(function(d) {return ""+d.PL1;})
      pl1Group = pl1Dim.group()
      yearDim = ndx.dimension(function(d){ return ""+d.Year})
      yearGroup = yearDim.group()
      dispDim = ndx.dimension(function(d) { return  ""+d.FARD})
      dispGroup = dispDim.group()
      Pl1FARDdim = ndx.dimension(function(d) {return [d["PL1"], d["FARD"]];})
      PL1FARDGroup = Pl1FARDdim.group()
      tableDim = ndx.dimension(function (d) {return +d.Serialnumber})
      ctaYearDim = ndx.dimension(function(d){ return ""+d.Year})
      ctaGroup = ctaYearDim.group().reduceSum(function(d){ return parseInt(d.CTA)/1000000})
      yearDim1 = ndx.dimension(function(d) { return d.Year;});
      yearDim1Group = yearDim1.group();
      regionDim = ndx.dimension(function(d) { return ""+d.Region;});
      regionDimGroup = regionDim.group(); 
      tcoYearDim = ndx.dimension(function(d){ return ""+d.Year})
      
      projTcoeDim = ndx.dimension(function(d){ return ""+d.Year})
      
	  
	    alldata=ndx.size();

      var appCount = alldata;

    /*yearGroup.all().forEach(function(d){
      console.log(d)
    })*/

   /* ctaGroup.all().forEach(function(d){
      console.log(d);
    })*/

      projTcoeGroup = projTcoeDim.group().reduceSum(function(d){ return +d.Value})
      projTcoeGroup.all().forEach(function(d){
          appCount = appCount - d.value; 
          d.value = appCount; 
          d.key = +d.key + 1;
          console.log(d.key + "---" + d.value);
          //alert(d.key + "+++" + d.value);
      })

      countryDim = ndx.dimension(function(d) {return ""+d.Country;})
      countryDimGrp =  countryDim.group() 

      var region = regionDimGroup.all()
    
      var country =  countryDimGrp.all()

      var TCOSum = 148013408/1000000;
      tcoGroup = tcoYearDim.group().reduceSum(function(d){ return +d.TotalBenefits/1000000})
      tcoGroup.all().forEach(function(d){
        TCOSum = TCOSum - d.value;
        d.value = TCOSum
        d.key = +d.key + 1;
      })

      // Drop Down for applying filter with Region
	  
	  var arrListRegion = [];
	  
	  for (var i=0 ; i<regionDimGroup.size(); i++){
		  if(region[i].key != ""){
			 arrListRegion.push(region[i].key);
			 document.getElementById("Region").options[i]=new Option(region[i].key);
			  }
	  }
	  
	 d3.select('#Region').on('change', function(){
		var reg = Region.options[Region.options.selectedIndex].value
		
		if(reg == "All"){
			console.log(reg)
			regionDim.filter(null)
			alldata = regionDim.top(Infinity).length
		}else{
			console.log(reg)
		  regionDim.filter(reg)
		  alldata = regionDim.top(Infinity).length
		  
		}	
		console.log(alldata)
			update(alldata);
			dc.redrawAll();    
		});


		// Drop Down for applying filter with Country
			
		var arrListCountry = [];
			
		for (var x=0 ; x < countryDimGrp.size(); x++){
			 if(country[x].key != "") {
				arrListCountry.push(country[x].key);
				document.getElementById("Country").options[x]=new Option(country[x].key);
			 }
	  }
	  	  
	d3.select('#Country').on('change', function(){
		var con = Country.options[Country.options.selectedIndex].value
		console.log(con)
		if(con == "All"){
			countryDim.filter(null)
			alldata = countryDim.top(Infinity).length
		}else{
		  countryDim.filter(con)
		  alldata = countryDim.top(Infinity).length  
		 
		}
		  update(alldata)    
		  dc.redrawAll(); 	  
		});

		
	//Pie Chart  for Process Level 1

  pieChart
    .cx(180)
    .cy(160)
    .width(500)
    .height(320)
    .slicesCap(5)
    .innerRadius(0)
    //.colors(colorbrewer.Paired[6])
    .dimension(pl1Dim)
    .group(pl1Group)
    .legend(dc.legend().x(360).y(40))
	  .on("filtered", function (chart) {
		dc.events.trigger(function () {
		alldata = pl1Dim.top(Infinity).length
		update(alldata);
      chart.selectAll('text.pie-slice').text(function(d) {
              var countPerc = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
             if(countPerc != "0%")
            return countPerc; 
        })
		});
	})
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
              var countPerc = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
             if(countPerc != "0%")
            return countPerc; 
        })
        });
   

    pieChart2
    .cx(262)
    .cy(160)
    .width(500)
    .height(320)
    .slicesCap(4)
    .innerRadius(90)
    //.colors(colorbrewer.Paired[6])
    .dimension(dispDim)
    .group(dispGroup)
    .legend(dc.legend().x(430).y(40))
	  .on("filtered", function (chart) {
		 dc.events.trigger(function () {
		 alldata = dispDim.top(Infinity).length
		 update(alldata);
      chart.selectAll('text.pie-slice').text(function(d) {
              var countPerc = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
             if(countPerc != "0%")
            return countPerc; 
        })
	  });
	})
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
             var countPerc = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
             if(countPerc != "0%")
             return countPerc; 
        })
    })

 /*barChart
  	.width(1228.78)
  	.height(250)
  	.x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(true)
    .colors(colorbrewer.RdYlGn[9])
    .dimension(yearDim)
    .group(yearGroup)
    .elasticY(true)
    .centerBar(true)
    .gap(2)
    .brushOn(true)
    .margins({left: 70 ,top: 10, bottom: 30, right: 50})
    .on('pretransition', function(chart) {
        chart.selectAll("rect.bar").on("click", function (d) {
            console.log('click');
            chart.filter(null)
                .filter(d.data.key)
                .redrawGroup();
        });
    });*/

    dataGrid
      .width(300)
      .height(300)
      .dimension(tableDim)
      .group(function (d){ return ""; })
      .size(ndx.size())
      .columns([
        function (d) {return d.ApplicationName;},
       function (d) {return d.PL1;},
       function (d) {return d.FARD;},
       function (d) {return d.CosttoArchive;},
       function (d) {return d.Levelefforttoexecute;},
       function (d) {return d.TCO;}

      ])
      .sortBy(function (d) {return d.Serialnumber;})
	  update(alldata);
	 
	 

  tcoeBarChart1
    .width(420)
    .height(320)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    //.brushOn(true)
    .colors("#ffa500")
    .elasticY(true)
    .clipPadding(10)
    .xAxisLabel("Year" , 1)
	  .yAxisLabel(" TCO in million $ " , 30)
    .dimension(tcoYearDim)
    .group(tcoGroup)
    //.brushOn(true)
    //.margins({left: 70 ,top: 10, bottom: 30, right: 50})
	.on("filtered", function (chart) {
		dc.events.trigger(function () {
		alldata = yearDim.top(Infinity)
	});
	})
    .on('pretransition', function(chart) {
        chart.selectAll("rect.bar").on("click", function (d) {
            console.log('click');
            chart.filter(null)
                .filter(d.data.key)
                .redrawGroup();
        });
    });

  tcoeBarChart2
    .width(420)
    .height(320)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    //.brushOn(true)
    .colors("#6dc066")
    .elasticY(true)
    .clipPadding(10)
    .xAxisLabel("Year" , 1)
	  .yAxisLabel("Cost to Achieve in milion $ ", 30)
    .dimension(ctaYearDim)
    .group(ctaGroup)
    //.brushOn(true)
    .margins({left: 70 ,top: 10, bottom: 30, right: 50})
    .on('pretransition', function(chart) {
        chart.selectAll("rect.bar").on("click", function (d) {
            console.log('click');
            chart.filter(null)
                .filter(d.data.key)
                .redrawGroup();
        });
    });

  tcoeLineChart
    .width(440)
    .height(340)
    .x(d3.scale.ordinal())
    //.interpolate('step-after')
    .xUnits(dc.units.ordinal)
    .renderDataPoints(true)
    .margins({left: 70, top: 10, right: 50, bottom: 30})
    .colors("#008000")
    .elasticY(true)
    .clipPadding(20)
    //.brushOn(true)
    .xAxisLabel("Year", 2)
    .yAxisLabel("Application Count ", 10)
    .dimension(projTcoeDim)
    .group(projTcoeGroup)


  categoryChart //rowChart
    .width(150).height(200)
    .dimension(yearDim1)          
    .group(yearDim1Group)
    .valueAccessor(function(d) {
      return 200; //fixed size to make a square checkbox
    })
    .title(function(d) { return d.key; })
     .on('pretransition', function(chart) {
    });

  categoryChart.xAxis().tickFormat(function(v) { return ""; }); 

 /* categoryChart12 //rowChart
    .width(150).height(300)
    .dimension(regionDim)          
    .group(regionDimGroup)
    .valueAccessor(function(d) {
      return 100; //fixed size to make a square checkbox
    })
    .title(function(d) { return d.key; })
     .on('pretransition', function(chart) {
    });

  categoryChart12.xAxis().tickFormat(function(v) { return ""; });  
  */

  dc.renderAll();

});

function changeCountry(country){
  console.log("hello country")
  if(country == "All"){
    countryDim.filter(null)
    regionDim.filter(null)

      alldata = countryDim.top(Infinity).length
      console.log(alldata)
      console.log("Inside if country")
  }  
} 


var ofs = 0, pag = 25; var end=0

     function display() {
      d3.select('#begin')
          .text(ofs);
      d3.select('#end')
          .text(end-1);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>alldata ? 'true' : null);
      d3.select('#size').text(alldata);
  }
  function update(alldata) {
	  if(alldata <= (ofs+pag)){
		  end=alldata
	  }
	  else{
		  end = ofs+pag
	  }
	  
      dataGrid.beginSlice(ofs);
      dataGrid.endSlice(end);

      display(alldata , end);

      //alert(alldata)

      appCount = alldata;
      //  tcoeLineChart.redraw();

      //alert(alldata+ "-------" + appCount);
  }
   function next() {
      ofs += pag;
      update(alldata);
      dataGrid.redraw();
  }
  function last() {
      ofs -= pag;
      update();
      dataGrid.redraw();
  }
