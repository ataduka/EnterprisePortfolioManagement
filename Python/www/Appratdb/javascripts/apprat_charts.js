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
var pl1Dim
var ctaGroup
var count
var countDim
var countGroup
var country
var region
var arrListRegion = [];
var arrListCountry = [];
var TCOSum

//CrossFilter Code begins
d3.csv("Test1_SM_v2.csv", function(error, experiments) {

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
      tcoYearDim = ndx.dimension(function(d){ return ""+d.Year})
      ctaYearDim = ndx.dimension(function(d){ return ""+d.Year})
      ctaGroup = ctaYearDim.group().reduceSum(function(d){ return +d.CTA/1000})
      yearDim1 = ndx.dimension(function(d) { return d.Year;});
      yearDim1Group = yearDim1.group();
      regionDim = ndx.dimension(function(d) { return ""+d.Region;})
      regionDimGroup = regionDim.group(); 
      projTcoeDim = ndx.dimension(function(d){ return ""+d.Year})
      var appCount = ndx.size();
	    countDim = ndx.dimension( function(d){ return d})
	
	  alldata=ndx.size();
	  var aaa;
	  var bbb;
	

      projTcoeGroup = projTcoeDim.group().reduceSum(function(d){ return +d.Value})
      projTcoeGroup.all().forEach(function(d){
		 	   if(d.key == "2014"){
				   aaa = +d.value;
				   console.log(aaa)
				   d.value=appCount
				   //d.key = d.key
			 console.log(d.key + "---" + d.value)
		  }else{
          appCount = appCount - aaa; 
		      aaa= d.value;
          d.value = appCount; 
          //d.key = d.key++;
	        console.log(d.key + "---" + d.value);}
      })

	  function updateAppCount(projTcoeDim){
	  console.log(projTcoeDim.top(Infinity).length)
	  appCount = projTcoeDim.top(Infinity).length;
	       projTcoeGroup = projTcoeDim.group().reduceSum(function(d){ return +d.Value})
          projTcoeGroup.all().forEach(function(d){
			    if(d.key == "2014"){
				   aaa = +d.value;
				   //console.log(bbb)
				   d.value=appCount
				   //d.key = d.key
			 console.log(d.key + "---" + d.value)
		  }else{
          appCount = appCount - aaa; 
		      aaa= d.value;
          d.value = appCount; 
          //d.key = d.key ++;
	  console.log(d.key + "---" + d.value);}
      })
	 tcoeLineChart.group(projTcoeGroup)
  }

      countryDim = ndx.dimension(function(d) {return ""+d.Country;})
      countryDimGrp =  countryDim.group() 

      region = regionDimGroup.all()
    
      country =  countryDimGrp.all()

      //var TCOSum = 148013408/1000000;
      //TCOSum = countDim.top(Infinity).reduceSum(function(d){ return +d.TCO/1000000})
     countGroup = countDim.group().reduceSum(function(d){ return +d.TCO/1000000})
      countGroup.all().forEach(function(d){
        TCOSum = +d.value;
      })
      tcoGroup = tcoYearDim.group().reduceSum(function(d){ return +d.TotalBenefits/1000000})
      tcoGroup.all().forEach(function(d){
        if(d.key=="2014"){
          bbb = +d.value
          d.value = TCOSum
        }else{
          TCOSum = TCOSum - bbb;
          bbb = d.value;
          d.value = TCOSum
        }
      })

      function updateTCO(countDim){
        countGroup = countDim.group().reduceSum(function(d){ return +d.TCO/1000000})
        countGroup.all().forEach(function(d){
          TCOSum = +d.value;
          //console.log("TCO----"+TCOSum)
        })
        tcoGroup = tcoYearDim.group().reduceSum(function(d){ return +d.TotalBenefits/1000000})
        tcoGroup.all().forEach(function(d){
          if(d.key=="2014"){
            bbb = +d.value
            d.value = TCOSum
          }else{
            TCOSum = TCOSum - bbb;
            bbb = d.value;
            d.value = TCOSum
          }
        })
      tcoeBarChart1.group(tcoGroup);
      }

      // Drop Down for applying filter with Region
	  
	  
	  
	  for (var i=0 ; i<regionDimGroup.size(); i++){
		  if(region[i].key != ""){
			 arrListRegion.push(region[i].key);
			 document.getElementById("Region").options[i+1]=new Option(region[i].key);
			  }
	  }
	  
	 d3.select('#Region').on('change', function(){
		var reg = Region.options[Region.options.selectedIndex].value
		
		if(reg == "All"){
			console.log(reg)
			regionDim.filter(null)
			alldata = regionDim.top(Infinity).length
			updateTCO(countDim);
			
		}else{
			console.log(reg)
		  regionDim.filter(reg)
		  alldata = regionDim.top(Infinity).length
		  updateAppCount(projTcoeDim);
		  updateTCO(countDim);
		  
		}	
		console.log(alldata)
		updateTest(alldata);
		updateAppCount(projTcoeDim)
		//updateTCO(countDim);
       tcoeBarChart1.group(tcoGroup);
       tcoeLineChart.group(projTcoeGroup);
		dc.redrawAll();    
		});


		// Drop Down for applying filter with Country
			
		
			
		for (var i=0 ; i < countryDimGrp.size(); i++){
			 if(country[i].key != "") {
				arrListCountry.push(country[i].key);
				document.getElementById("Country").options[i+1]=new Option(country[i].key);
			 }
	  }
	  	  
	d3.select('#Country').on('change', function(){
		var con = Country.options[Country.options.selectedIndex].value
		console.log(con)
		if(con == "All"){
			countryDim.filter(null)
			alldata = countryDim.top(Infinity).length
			console.log(alldata)
			updateTCO(countDim);
		}else{
		  countryDim.filter(con)
		  alldata = countryDim.top(Infinity).length  
		  updateAppCount(projTcoeDim);
		 console.log(dispDim.top(Infinity).length)
		 updateTCO(countDim);

		}
		  updateTest(alldata);
		  updateAppCount(projTcoeDim)
     tcoeBarChart1.group(tcoGroup);  
     tcoeLineChart.group(projTcoeGroup);  
		  dc.redrawAll(); 	  
		});
		
		

		
	//Pie Chart  for Process Level 1

  pieChart
    .cx(180)
    .cy(160)
    .width(500)
    .height(320)
    .innerRadius(0)
    //.colors(colorbrewer.Paired[6])
    .dimension(pl1Dim)
    .group(pl1Group)
    .legend(dc.legend().x(360).y(40))
	  .on("filtered", function (chart) {
		dc.events.trigger(function () {
		alldata = pl1Dim.top(Infinity).length
		console.log(projTcoeDim.top(Infinity).length)
		updateAppCount(projTcoeDim);
    updateTCO(countDim);
		updateTest(alldata);		
		
			 chart.selectAll('text.pie-slice').text(function(d) {
			var xyz = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
			if(xyz != "0%")
            return xyz;
		 })
		 
		});
	})
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
			
           	var xyz = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%'
			if(xyz != "0%")
            return xyz;
        });
    })
	

    pieChart2
    .cx(262)
    .cy(160)
    .width(500)
    .height(320)
    .innerRadius(90)
    //.colors(colorbrewer.Paired[6])
    .dimension(dispDim)
    .group(dispGroup)
    .legend(dc.legend().x(430).y(40))
	.on("filtered", function (chart) {
		dc.events.trigger(function () {
		 alldata = dispDim.top(Infinity).length
		 updateTest(alldata)
		 updateAppCount(projTcoeDim);
     updateTCO(countDim);
		//console.log(dispDim.top(Infinity)[1].FARD)
	  var abc = dispDim.top(Infinity).length
	  var test = false
		dispDim.top(Infinity).forEach(function (d, i){
			if((dispDim.top(Infinity)[i].FARD == "Eliminate") || (dispDim.top(Infinity)[i].FARD == "Migrate")) 
				test = true;

})

		 chart.selectAll('text.pie-slice').text(function(d) {
			 
			var xyz = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%';
			if(xyz != "0%")
            return xyz;
		
		 })
	  });
	})
    // workaround for #703: not enough data is accessible through .label() to display percentages
    .on('pretransition', function(chart) {
        chart.selectAll('text.pie-slice').text(function(d) {
			var xyz = dc.utils.printSingleValue(Math.round((d.endAngle - d.startAngle) / (2*Math.PI) * 100)) + '%'
			if(xyz != "0%")
            return xyz;
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
        function (d) {return d.Region;},
        function (d) {return d.Country;},
       function (d) {return d.PL1;},
       function (d) {return d.FARD;},
       function (d) {return d.FinalTargetApp;},
       function (d) {return d.Year;},
       function (d) {return d.TCO;},
       function (d) {return d.CTA;},
       function (d) {return d.TotalBenefits;},
       function (d) {return d.Levelefforttoexecute;}
      ])
      .sortBy(function (d) {return d.Serialnumber;})
	  update(alldata);
	 
	 

  tcoeBarChart1
    .width(420)
    .height(320)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .brushOn(true)
    .colors("#008DB7")
    .elasticY(true)
    .clipPadding(10)
    .xAxisLabel("Year" , 1)
	  .yAxisLabel(" TCO in million $ " , 30)
    .title(function(d){
      return d.key+": $"+(+d.value).toFixed(2)+" million";
    })
    .dimension(tcoYearDim)
    .group(tcoGroup)
    .brushOn(true)
    .margins({left: 70 ,top: 10, bottom: 30, right: 50})
	  .on("filtered", function (chart) {
		dc.events.trigger(function () {
		alldata = yearDim.top(Infinity).length
    updateTest(alldata);
		updateAppCount(projTcoeDim)
    //updateTCO(countDim);
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
    .brushOn(true)
    .colors("#6dc066")
    .elasticY(true)
    .clipPadding(10)
    .xAxisLabel("Year" , 1)
	  .yAxisLabel("Cost to Achieve in thousand $ ", 30)
    .title(function(d){
      return d.key+": $"+(+d.value)+" thousand";
    })
    .dimension(ctaYearDim)
    .group(ctaGroup) 
    .brushOn(true)
    .margins({left: 70 ,top: 10, bottom: 30, right: 50})
  .on("filtered", function (chart) {
    dc.events.trigger(function () {
    alldata = yearDim.top(Infinity).length
    updateTest(alldata);
    updateAppCount(projTcoeDim)
    updateTCO(countDim);
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
    .brushOn(true)
    .xAxisLabel("Year", 2)
    .yAxisLabel("Application Count ", 10)
    .dimension(projTcoeDim)
    .group(projTcoeGroup)
	   .on('pretransition', function(d) {
       
    });


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
			alldata = countryDim.top(Infinity).length
			console.log(alldata)
			console.log("Inside if country")
	}
	
	
}
var ofs = 0, pag = 25; var end=0

     function display() {
      d3.select('#begin')
          .text(ofs+1);	
      d3.select('#end')
          .text(end);
      d3.select('#last')
          .attr('disabled', ofs-pag<0 ? 'true' : null);
      d3.select('#next')
          .attr('disabled', ofs+pag>=alldata ? 'true' : null);
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
    function updateTest(alldata) {
		ofs =0;
		pag = 25;
		end = 0;
		if(alldata<1){
      ofs = -1;
    }

	  if(alldata <= (ofs+pag)){
		  end=alldata
	  }
	  else{
		  end = ofs+pag
	  }
	  
      dataGrid.beginSlice(ofs);
      dataGrid.endSlice(end);

      display(alldata , end);
  }
  
  
  function dynamicDD(){
	 var reg = Region.options[Region.options.selectedIndex].value
	 if(reg == "ASPAC"){	
		 countryDim.filter(null)
	     document.getElementById("Country").options.length = 0;
		 document.getElementById("Country").options[0]=new Option("All");		 
		 document.getElementById("Country").options[1]=new Option("Japan");
		 document.getElementById("Country").options[2]=new Option("Korea");
		 document.getElementById("Country").options[3]=new Option("China");
		 document.getElementById("Country").options[4]=new Option("India");
		 document.getElementById("Country").options[5]=new Option("Hong Kong");
		 document.getElementById("Country").options[6]=new Option("Taiwan");
		 document.getElementById("Country").options[7]=new Option("Australia");
     document.getElementById("Country").options[8]=new Option("Pakistan");
	 }
	 if(reg == "EMEA"){	
         countryDim.filter(null)	 
	     document.getElementById("Country").options.length = 0;
		 document.getElementById("Country").options[0]=new Option("All");		 
		 document.getElementById("Country").options[1]=new Option("Israel");
		 document.getElementById("Country").options[2]=new Option("Italy");
		 document.getElementById("Country").options[3]=new Option("Germany");
		 document.getElementById("Country").options[4]=new Option("Czech Republic");
		 document.getElementById("Country").options[5]=new Option("Benelux");
		 document.getElementById("Country").options[6]=new Option("France");
		 document.getElementById("Country").options[7]=new Option("Switzerland");
		 document.getElementById("Country").options[8]=new Option("Turkey");
		 document.getElementById("Country").options[9]=new Option("Belgium");
		 document.getElementById("Country").options[10]=new Option("UK");
		 document.getElementById("Country").options[11]=new Option("Iberia");
     document.getElementById("Country").options[12]=new Option("Netherlands");
     document.getElementById("Country").options[13]=new Option("Norway");
     document.getElementById("Country").options[14]=new Option("Austria");
     document.getElementById("Country").options[15]=new Option("Denmark");
     document.getElementById("Country").options[16]=new Option("Egypt");
     document.getElementById("Country").options[17]=new Option("Finland");
     document.getElementById("Country").options[18]=new Option("Greece");
     document.getElementById("Country").options[19]=new Option("Ireland");
     document.getElementById("Country").options[20]=new Option("Nordics");
     document.getElementById("Country").options[21]=new Option("Poland");
     document.getElementById("Country").options[22]=new Option("Portugal");
     document.getElementById("Country").options[23]=new Option("Romania");
     document.getElementById("Country").options[24]=new Option("Russia");
     document.getElementById("Country").options[25]=new Option("SE Region");
     document.getElementById("Country").options[26]=new Option("South Africa");
     document.getElementById("Country").options[27]=new Option("Spain");
     document.getElementById("Country").options[28]=new Option("Sweden");
     document.getElementById("Country").options[29]=new Option("UAE");
	 }
/*	  if(reg == "LATAM"){		
		 countryDim.filter(null)	  
	     document.getElementById("Country").options.length = 0;
		 document.getElementById("Country").options[0]=new Option("All");		 
		 document.getElementById("Country").options[1]=new Option("BR");
		 document.getElementById("Country").options[2]=new Option("Latin America");
		 document.getElementById("Country").options[3]=new Option("Mexico");
		 document.getElementById("Country").options[4]=new Option("Brazil");
		 document.getElementById("Country").options[5]=new Option("LATAM");
	 }*/
	   if(reg == "America"){
		 countryDim.filter(null)
	     document.getElementById("Country").options.length = 0;		 
		 document.getElementById("Country").options[0]=new Option("All");	
		 document.getElementById("Country").options[1]=new Option("USA");		 
		 document.getElementById("Country").options[2]=new Option("Canada");
		 document.getElementById("Country").options[3]=new Option("Puerto Rico");
		 document.getElementById("Country").options[4]=new Option("Mexico");
		 document.getElementById("Country").options[5]=new Option("Brazil");
		 document.getElementById("Country").options[6]=new Option("Ecuador");
	 }
	 if(reg == "GLOBAL") {
		 
		 countryDim.filter(null)		 
	     document.getElementById("Country").options.length = 0;		 
		 document.getElementById("Country").options[0]=new Option("All");	
		 document.getElementById("Country").options[1]=new Option("US & UK");
		 document.getElementById("Country").options[2]=new Option("Global");
		 
	 }
		 
		 if(reg == "All") {		 
		 countryDim.filter(null)		 
	     document.getElementById("Country").options.length = 0;		 		 
		 document.getElementById("Country").options[0]=new Option("All");	
		 for (var x=0 ; x < countryDimGrp.size(); x++){
		 if(country[x].key != "") {
		 arrListCountry.push(country[x].key);
		document.getElementById("Country").options[x+1]=new Option(country[x].key);
		 }
	  }  	  
		 
	 }
	 
	/* for (var x=0 ; x < countryDimGrp.size(); x++){
		 if(country[x].key != "") {
		 arrListCountry.push(country[x].key);
		document.getElementById("Country").options[x]=new Option(country[x].key);
		 }
	  }*/
	 
	// dumyDim.
//	 countryDim.top(Infinity).length 

 }
 
