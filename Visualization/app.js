function finalproj(){
    var filePath="data.csv";
    question0(filePath);
    viz1(filePath);
    viz2(filePath);
    viz3(filePath);
    viz4(filePath);
    viz5(filePath);


}

var question0=function(filePath){
    d3.csv(filePath).then(function(data){
    });
}

//Done
var viz1=function(filePath){
    d3.csv(filePath).then(function(data){
        v1data = data.filter(d => d.Genre != "")
        v1data = v1data.filter(d => !isNaN(d.Year_of_Release))
        v1data = v1data.filter(d => d.Year_of_Release < 2017)
        v1svgwidth = 800;
        v1svgheight = 800;
        v1padding = 50;
        v1data = v1data.map(function(d){
            return{
                NA_Sales : +d.NA_Sales,
                EU_Sales : +d.EU_Sales
            }
        })

        v1data = v1data.filter(d => d.NA_Sales > 0.2)
        v1data = v1data.filter(d => d.EU_Sales > 0.2)

        v1min = d3.min(v1data, d => d.NA_Sales)
        var v1svg = d3.select('#v1_plot').append('svg').attr('width', v1svgwidth).attr('height',v1svgheight)

        var v1xScale = d3.scaleLog().domain([v1min,d3.max(v1data, d => d.NA_Sales)]).range([v1padding, v1svgwidth-v1padding])
        
        var v1yScale = d3.scaleLog().domain([v1min,d3.max(v1data, d => d.NA_Sales)]).range([v1svgheight-v1padding, v1padding])

        var v1xAxis = d3.axisBottom(v1xScale).ticks(10,'')
        var v1yAxis = d3.axisLeft(v1yScale).ticks(10,'')
        v1svg.append('g').attr('transform', 'translate(0,'+ (v1svgheight - v1padding)+')').call(v1xAxis)
        v1svg.append('g').attr('transform', 'translate('+ v1padding+',0)').call(v1yAxis).attr('class', 'yAxis')
        v1svg.append('text').attr('text-anchor','middle').attr('x', v1svgwidth/2).attr('y',v1svgheight-10).attr('font-size', 20).text('Sales in NA (Millions)')
        v1svg.append('text').attr('text-anchor','middle').attr('x', 15).attr('y',v1svgheight/2).attr('transform','rotate(-90) translate(-400, -385)').attr('font-size', 20).text('Sales in EU (Millions)')
        v1svg.append('text').attr('text-anchor','middle').attr('x', v1svgwidth/2).attr('y',15).attr('font-size', 20).text('Sales in NA Compared To Sales in EU')


        v1svg.selectAll('.circ').data(v1data).enter().append('circle')
        .attr('cx', d => v1xScale(d.NA_Sales))
        .attr('cy', d=> v1yScale(d.EU_Sales))
        .attr('r', 3)
        .attr('fill', 'red')


    });
}

//Done
var viz2=function(filePath){
    d3.csv(filePath).then(function(data){
        v2data = data.filter(d => d.Genre != "")
        v2data = v2data.filter(d => !isNaN(d.Year_of_Release))
        v2data = v2data.filter(d => d.Year_of_Release < 2017)
        v2o_data = v2data
        v2svgwidth = 1000;
        v2svgheight = 1000;
        v2padding = 65;
        v2data = v2data.map(function(d){
            return{
                Platform : d.Platform,
                Global_Sales : +d.Global_Sales
            }
        })



        v2data = d3.rollups(v2data, v => d3.sum(v, d => d.Global_Sales), d => d.Platform)

        v2data = v2data.map(function(d){
            return {
                Platform : d[0],
                Global_Sales : d[1]
            }
        })

        var v2svg = d3.select('#v2_plot').append('svg').attr('width', v2svgwidth).attr('height',v2svgheight)

        var v2yScale = d3.scaleBand().domain(v2data.map(d => d.Platform)).range([v2svgheight-v2padding, v2padding]).padding(0.1)
        
        var v2xScale = d3.scaleLinear().domain([0,d3.max(v2data, d => d.Global_Sales)]).range([v2padding, v2svgwidth - v2padding])

        var v2xAxis = d3.axisBottom(v2xScale)
        var v2yAxis = d3.axisLeft(v2yScale)
        v2svg.append('g').attr('transform', 'translate(0,'+ (v2svgheight - v2padding)+')').call(v2xAxis).attr('class', 'xAxis')
        v2svg.append('g').attr('transform', 'translate('+ v2padding+',0)').call(v2yAxis).attr('class', 'yAxis')
        v2svg.append('text').attr('class','xTitle').attr('text-anchor','middle').attr('x', v2svgwidth/2).attr('y',v2svgheight-20).attr('font-size', 20).text('Global Sales (Millions)')
        v2svg.append('text').attr('class','yTitle').attr('text-anchor','middle').attr('x', 15).attr('y',v2svgheight/2).attr('transform','rotate(-90) translate(-500, -480)').attr('font-size', 20).text('Platform')
        v2svg.append('text').attr('class','oTitle').attr('text-anchor','middle').attr('x', v2svgwidth/2).attr('y',35).attr('font-size', 20).text('Global Scales of Each Platform')
        v2clicked = false

        //when you click one of the bars which represents a platform the bar will 
        //“explode” into genres so a new graph will be generated that depicts the 
        //total sales per genre of the platform that was clicked on.
        viz2click = function(d){
            if(v2clicked == true){return}
            v2clicked = true
            v2svgwidth = 1000;
            v2svgheight = 1000;
            v2padding = 65;
            plat = d3.select(this).attr('platform')

            v2f_data = v2o_data.filter(d => d.Platform == plat)

            genres = Array.from(new Set(v2f_data.map(d => d.Genre)))

            v2f_data = d3.rollups(v2f_data, v => d3.sum(v, d => d.Global_Sales), d => d.Genre)

            v2f_data = v2f_data.map(function(d){
                return{
                    Genre : d[0],
                    Global_Sales : d[1]
                }
            })

            var v2yScale = d3.scaleLinear().domain([0,d3.max(v2f_data, d => d.Global_Sales)]).range([v2svgheight-v2padding, v2padding])

            var v2xScale = d3.scaleBand().domain(v2f_data.map(d => d.Genre)).range([v2padding, v2svgwidth - v2padding]).padding(0.1)
            var v2xAxis = d3.axisBottom(v2xScale)
            var v2yAxis = d3.axisLeft(v2yScale)


            v2svg.selectAll("g.xAxis")
            .transition(700)
            .call(v2xAxis)
            v2svg.selectAll("g.yAxis")
            .transition(700)
            .call(v2yAxis)

            var rects = v2svg.selectAll('.viz2rect').data(v2f_data)

            rects.transition(700).attr('x', d => v2xScale(d.Genre))
            .attr('y', d => v2yScale(d.Global_Sales))
            .attr('width', v2xScale.bandwidth())
            .attr('platform', d => d.Platform)
            .attr('height', d => v2svgheight -v2padding - v2yScale(d.Global_Sales))

            rects.exit().remove()

            v2svg.select("text.oTitle")._groups[0][0].innerHTML = 'Global Sales of ' + plat + ' by Genre'
            v2svg.select("text.xTitle")._groups[0][0].innerHTML = 'Genre'
            v2svg.select("text.yTitle")._groups[0][0].innerHTML = 'Global Sales (Millions)'


        }
        v2svg.selectAll('.viz2rect').data(v2data).enter().append('rect')
        .attr('class','viz2rect')
        .attr('x', d => v2xScale(0))
        .attr('y', d => v2yScale(d.Platform))
        .attr('width', d=> v2xScale(d.Global_Sales)-v2padding)
        .attr('platform', d => d.Platform)
        .attr('height', v2yScale.bandwidth())
        .attr('fill','red')
        .on('mouseover', function(d){
            d3.select(this).attr('stroke','black').attr('stroke-width', '3')
        })
        .on('mouseout', function(d){
            d3.select(this).attr('stroke','none')
        })
        .on('click', viz2click)

    });
}

//Done
var viz3=function(filePath){
    d3.csv(filePath).then(function(data){
        v3svgwidth = 1000;
        v3svgheight = 1000;
        v3padding = 65;
        v3data = data.map(function(d){
            return {
                Year_of_Release : +d.Year_of_Release,
                Genre : d.Genre,
                Global_Sales : +d.Global_Sales
            }
        })
        v3data = v3data.filter(d => d.Genre != "")
        v3data = v3data.filter(d => !isNaN(d.Year_of_Release))
        v3data = v3data.filter(d => d.Year_of_Release < 2017)
        v3o_data = v3data

        v3genres = Array.from(new Set(v3data.map(d => d.Genre)))
        v3data = (d3.rollups(v3data,function(v){
            tr = []
            for(let i in v3genres){
                temp = v.filter(d => d.Genre == v3genres[i])
                tr.push(d3.sum(temp, d => d.Global_Sales))
            }
            tr.push(d3.sum(v, d => d.Global_Sales))
            return tr
        }, d => d.Year_of_Release))

        v3data = (v3data.map(function(d){
            tr = {}
            tr['Year_of_Release'] = d[0]
            for(let i in d[1]){
                if(d[1][i] !=d[1].slice(-1)[0]){
                    tr[v3genres[i]] = d[1][i]
                }
            }
            tr['Total']=d[1].slice(-1)[0]
            return tr
        }))

        v3data = d3.sort(v3data, d => d.Year_of_Release)

        var v3svg = d3.select('#v3_plot').append('svg').attr('width', v3svgwidth).attr('height',v3svgheight)

        var v3yScale = d3.scaleLinear().domain([0,d3.max(v3data, d => d.Total)]).range([v3svgheight-v3padding, v3padding])
        
        var v3xScale = d3.scaleBand().domain(v3data.map(d => d.Year_of_Release)).range([v3padding, v3svgwidth - v3padding]).padding(0.1)
        var v3colorScale = d3.scaleOrdinal().domain(v3genres).range(d3.schemeSet3)

        var v3xAxis = d3.axisBottom(v3xScale)
        var v3yAxis = d3.axisLeft(v3yScale)
        v3svg.append('g').attr('transform', 'translate(0,'+ (v3svgheight - v3padding)+')').call(v3xAxis).selectAll('text').attr('text-anchor','end').attr('transform','rotate(-45)')
        v3svg.append('g').attr('transform', 'translate('+ v3padding+',0)').call(v3yAxis).attr('class', 'yAxis')
        v3svg.append('text').attr('class','xTitle').attr('text-anchor','middle').attr('x', v3svgwidth/2).attr('y',v3svgheight-15).attr('font-size', 20).text('Year')
        v3svg.append('text').attr('class','yTitle').attr('text-anchor','middle').attr('x', 15).attr('y',v3svgheight/2).attr('transform','rotate(-90) translate(-500, -480)').attr('font-size', 20).text('Global Sales (Millions)')
        v3svg.append('text').attr('class','oTitle').attr('text-anchor','middle').attr('x', v3svgwidth/2).attr('y',35).attr('font-size', 20).text('Global Scales of Genres Over Time')

        console.log(v3genres)

        v3svg.selectAll('.legendsquare').data(v3genres).enter().append('rect')
        .attr('x', 120)
        .attr('y', (d,i) => 470 - 30*(1+i))
        .attr('width',20)
        .attr('height', 20)
        .attr('fill', d => v3colorScale(d))
        .attr('class','legendsquare')
        .attr('genre',d => d)

        v3svg.selectAll('.legendtext').data(v3genres).enter().append('text')
        .attr('x', 150)
        .attr('y', (d,i) => 483 - 30*(1+i))
        .attr("font-size", "15px")
        .attr("alignment-baseline","middle")
        .text(d => d)
        .attr('class','legendtext')

        

        var stackedData = d3.stack().keys(v3genres)(v3data)

        v3clicked = false
        viz3click = function(d){
            if(v3clicked == true){return}
            v3svgwidth = 1000;
            v3svgheight = 1000;
            v3padding = 65;

            gen = d3.select(this).attr('genre')

            v3f_data = v3o_data.filter(d => d.Genre == gen)

            v3f_data = d3.rollups(v3f_data, v => d3.sum(v, d => d.Global_Sales), d => d.Year_of_Release)

            v3f_data = v3f_data.map(function(d){
                return{
                    Year_of_Release : d[0],
                    Global_Sales : d[1]
                }
            })


            var v3yScale = d3.scaleLinear().domain([0,d3.max(v3f_data, d => d.Global_Sales)]).range([v3svgheight-v3padding, v3padding])

            var v3yAxis = d3.axisLeft(v3yScale)

            v3svg.selectAll('.viz3Layer').remove()

            v3svg.selectAll('.legendsquare').remove()
            v3svg.selectAll('.legendtext').remove()

            v3svg.selectAll("g.yAxis").transition(700).call(v3yAxis)


            rects = v3svg.selectAll('.viz3rect').data(v3f_data).enter().append('rect')
            .attr('x', d => v3xScale(d.Year_of_Release))
            .attr('y', d => v3yScale(d.Global_Sales))
            .attr('width', v3xScale.bandwidth())
            .attr('height', d => v3svgheight -v3padding - v3yScale(d.Global_Sales))
            .attr('fill','red')
            .on('mouseover', function(d){
                d3.select(this).attr('stroke','black').attr('stroke-width', '3')
            })
            .on('mouseout', function(d){
                d3.select(this).attr('stroke','none')
            })

            v3svg.select("text.oTitle")._groups[0][0].innerHTML = 'Global Sales of ' + gen + ' Games by Year'
            v3svg.select("text.xTitle")._groups[0][0].innerHTML = 'Year'
            v3svg.select("text.yTitle")._groups[0][0].innerHTML = 'Global Sales (Millions)'

        }

        v3svg.selectAll('.viz3layer').data(stackedData)
        .join('path')
        .attr('class','viz3Layer')
        .attr('fill', d => v3colorScale(d.key))
        .attr('genre',d => d.key)
        .attr("d", d3.area()
        .x(function(d){
            return v3xScale(d.data.Year_of_Release) + v3xScale.step()/2})
        .y0(d => v3yScale(d[0]))
        .y1(d => v3yScale(d[1])))
        .on('mouseover', function(d){
            d3.select(this).attr('stroke','black').attr('stroke-width', '3')
            curr_gen =d3.select(this).attr('genre')
            v3svg.selectAll('.legendsquare').attr('stroke',function(j){
                if(j == curr_gen){
                    return 'black'
                }
            })
            .attr('stroke-width', '3')
        })
        .on('mouseout', function(d){
            d3.select(this).attr('stroke','none')
            v3svg.selectAll('.legendsquare').attr('stroke', 'none')
        })
        .on('click',viz3click)


    });
}

//Done
var viz4=function(filePath){
    d3.csv(filePath).then(function(data){
        v4svgwidth = 1200;
        v4svgheight = 800;
        v4data = data.map(function(d){
            return {
                NA_Sales : +d.NA_Sales,
                EU_Sales : +d.EU_Sales,
                JP_Sales : +d.JP_Sales
            }
        })
        v4data = {
            NA_Sales : d3.sum(v4data, d=>d.NA_Sales),
            EU_Sales : d3.sum(v4data, d=>d.EU_Sales),
            JP_Sales : d3.sum(v4data, d=>d.JP_Sales)

        }
        projection = d3.geoEquirectangular().translate([v4svgwidth/2, v4svgheight/2])
        pathgeo = d3.geoPath().projection(projection)
        var v4svg = d3.select('#v4_plot').append('svg').attr('width',v4svgwidth).attr('height',v4svgheight)

        v4colorScale = d3.scaleLinear().domain(d3.extent(Object.values(v4data))).range([0,1])

        blues = d3.interpolateBlues;

        worldmap = d3.json('world.json')

        eu = ['GBR', 'DEU', 'FRA', 'IRL', 'DNK','ISL','ESP','PRT','CHE','ITA','BEL','NLD','LUX','RUS', 'NOR','SWE','FIN','POL','AUT','CZE','BLR','EST','LTU','LVA','GRC','CYP','SVK','HRV','ALB','UKR','SVN','BIH','HUN','ROU','MDA','SRB','MKD','BGR','OSA','MNE']
        na = ['USA', 'CAN', 'MEX', 'CUB','GRL','GTM','BLZ','SLV','HND','NIC','PAN','CRI', 'HTI','DOM']

        v4svg.append('text').attr('class','oTitle').attr('text-anchor','middle').attr('x', v4svgwidth/2).attr('y',35).attr('font-size', 20).text('Global Sales by Region (in millions $)')
        
        worldmap.then(function(map){
            v4svg.selectAll('path').data(map.features).enter().append('path')
            .attr('d', pathgeo).attr('fill', function(d){
                if (eu.includes(d.id)){
                    return blues(v4colorScale(v4data.EU_Sales))
                }
                else if (na.includes(d.id)){
                    return blues(v4colorScale(v4data.NA_Sales)+.3)
                }
                else if (d.id == 'JPN'){
                    return blues(v4colorScale(v4data.JP_Sales)+.2)
                }
                return'white'})
            .attr('stroke','black')
            .attr('country',d => d.properties.name)
            colors = [blues(v4colorScale(v4data.JP_Sales)+.2),blues(v4colorScale(v4data.EU_Sales)+.2),blues(v4colorScale(v4data.USA_Sales))]
            vals = [v4data.JP_Sales,v4data.EU_Sales,v4data.NA_Sales]
            v4svg.selectAll('.legendsquare').data(colors).enter().append('rect')
            .attr('x', 120)
            .attr('y', (d,i) => 470 - 30*(1+i))
            .attr('width',20)
            .attr('height', 20)
            .attr('fill', d => d)
            .attr('class','legendsquare')
            .attr('stroke','black')    
            v4svg.selectAll('.legendtext').data(vals).enter().append('text')
            .attr('x', 150)
            .attr('y', (d,i) => 483 - 30*(1+i))
            .attr("font-size", "15px")
            .attr("alignment-baseline","middle")
            .text(d => d)
            .attr('class','legendtext')


        })
    });
}

//Done
var viz5=function(filePath){
    d3.csv(filePath).then(function(data){
        v5data = data.filter(d => d.Genre != "")
        v5data = v5data.filter(d => !isNaN(d.Year_of_Release))
        v5data = v5data.filter(d => d.Year_of_Release < 2017)
        v5o_data = v5data
        v5genres = Array.from(new Set(v5data.map(d => d.Genre)))
        nldata = {}
        v5data = v5data.map(function(d){
            return{
                Name : d.Name,
                Platform : d.Platform
            }
        })
        choices = ['All Genres']
        v5genres.forEach(d => choices.push(d))
        d3.select("#selectButton")
        .selectAll('myOptions')
        .data(choices)
        .enter()
        .append('option')
        .text(d => d)
        .attr("value", d => d)

        platforms = Array.from(new Set(v5data.map(d => d.Platform)))
        platforms = (platforms.map(function(d){
            return{
                Platform : d
            }
        }))

        nldata['nodes'] = platforms

        covered_pairs = []

        edges = []
        
        for (let i in platforms){
            for (let j in platforms){
                if (i != j){
                    if(!covered_pairs.includes(i+j) && !covered_pairs.includes(j+i)){
                        covered_pairs.push(i+j)
                        p = [platforms[i].Platform, platforms[j].Platform]
                        cdata = v5data.filter(d => p.includes(d.Platform))

                        l = d3.rollups(cdata, v => v.length, d => d.Name).filter(d => d[1] > 1).length

                        if(l > 1){
                            edges.push({
                                source : +i,
                                target : +j,
                                shared : l
                            })
                        }
                    }
                }
            }
        }

        edges = edges.filter(d => d.shared > 1)

        nldata['edges'] = edges

        v5svgwidth = 1000;
        v5svgheight = 1000;

        wscale = d3.scaleLinear().domain([1,d3.max(nldata.edges, d=> d.shared)]).range([.5,10])

        var force = d3.forceSimulation(nldata.nodes)
        .force('charge',d3.forceManyBody())
        .force('link', d3.forceLink(nldata.edges).distance(400))
        .force('center', d3.forceCenter(v5svgwidth/2,v5svgheight/2))

        var v5svg = d3.select("#v5_plot")
        .append("svg")
        .attr("width", v5svgwidth)
        .attr("height", v5svgheight);

        var edges = v5svg.selectAll('link').data(nldata.edges)
        .enter()
        .append('line')
        .attr('stroke','lightgray')
        .attr('class', 'edge')
        .attr('source', d => d.source.Platform)
        .attr('target', d=> d.target.Platform)

        var v5tip = d3.select("body").append("div").attr('class','tooltip')
        .style('opacity',.5)

        var v5mouseover = function(d){
            curr_plat = d3.select(this)._groups[0][0].__data__.Platform
            v5svg.selectAll('.edge').attr('stroke', function(d){
                if(d.source.Platform == curr_plat || d.target.Platform == curr_plat){
                    return 'red'
                }
                else{
                    return 'lightgray'
                }
            })
            v5tip.style('opacity',1)
        }

        var v5mouseout = function(d){
            v5svg.selectAll('.edge').attr('stroke', 'lightgray')
            v5tip.style('opacity',0)

        }

        var v5mousemove = function(e,d){
            tr =''
            tr += 'Selected Platform: ' + d.Platform + "<br/>"
            tr += 'Shared Titles With Other Platforms: <br/>'
            var has_edges = false

            for(let i in edges._groups[0]){
                if (d.Platform == edges._groups[0][i].__data__.source.Platform){
                    has_edges = true
                    tr += edges._groups[0][i].__data__.target.Platform +' : ' + edges._groups[0][i].__data__.shared
                    if(edges._groups[0][i].__data__.index != edges._groups[0].length){
                        tr += '<br/>'
                    }
                }
                if (d.Platform == edges._groups[0][i].__data__.target.Platform){
                    has_edges = true
                    tr += edges._groups[0][i].__data__.source.Platform +' : ' + edges._groups[0][i].__data__.shared
                    if(edges._groups[0][i].__data__.index != edges._groups[0].length){
                        tr += '<br/>'
                    }
                }
            }


            if(has_edges == false){
                tr += 'This Platform does not share more than 1 title with any other Platform'
            }

            v5tip.html(tr)
            
            
            v5tip.style("left", (e.pageX-(parseInt(v5tip.style("width"))/2) - 5) + "px")
            .style("top", (e.pageY-(parseInt(v5tip.style("height")))-20)+ "px")
        }

        var nodes = v5svg.selectAll('circle').data(nldata.nodes).enter().append('circle')
        .attr('fill', 'blue')
        .attr('stroke','black')
        .attr('platform', (d) => d.Platform)
        .on('mouseover', v5mouseover)
        .on('mouseout', v5mouseout)
        .on('mousemove', v5mousemove)
        .attr('class','node')

        var drop = d3.select('#selectButton')
        .attr('name', 'rest').on("change", function (d){
            s_genre = d.target.value
            v5svgwidth = 1000;
            v5svgheight = 1000;
            v5c_data = v5o_data

            v5svg.selectAll('.node').remove()
            v5svg.selectAll('.edge').remove()

            if(s_genre != 'All Genres'){
                v5c_data = v5c_data.filter(d => d.Genre == s_genre)
            }
            nldata = {}
            v5c_data = v5c_data.map(function(d){
                return{
                    Name : d.Name,
                    Platform : d.Platform
                }
            })

            v5platforms = Array.from(new Set(v5data.map(d => d.Platform)))
            v5platforms = (v5platforms.map(function(d){
                return{
                    Platform : d
                }})    
            )
            nldata['nodes'] = v5platforms

            covered_pairs = []

            edges = []
            
            for (let i in platforms){
                for (let j in platforms){
                    if (i != j){
                        if(!covered_pairs.includes(i+j) && !covered_pairs.includes(j+i)){
                            covered_pairs.push(i+j)
                            p = [platforms[i].Platform, platforms[j].Platform]
                            cdata = v5c_data.filter(d => p.includes(d.Platform))

                            l = d3.rollups(cdata, v => v.length, d => d.Name).filter(d => d[1] > 1).length

                            if(l > 1){
                                edges.push({
                                    source : +i,
                                    target : +j,
                                    shared : l
                                })
                            }
                        }
                    }
                }
            }
            edges = edges.filter(d => d.shared > 1)

            nldata['edges'] = edges

            wscale = d3.scaleLinear().domain([1,d3.max(nldata.edges, d=> d.shared)]).range([.5,10])

            var force = d3.forceSimulation(nldata.nodes)
            .force('charge',d3.forceManyBody())
            .force('link', d3.forceLink(nldata.edges).distance(400))
            .force('center', d3.forceCenter(v5svgwidth/2,v5svgheight/2))

            var edges = v5svg.selectAll('.edge').data(nldata.edges)
            .enter()
            .append('line')
            .attr('stroke','lightgray')
            .attr('class', 'edge')
            .attr('source', d => d.source.Platform)
            .attr('target', d=> d.target.Platform)

            var v5mouseout = function(d){
                v5svg.selectAll('.edge').attr('stroke', 'lightgray')
                v5tip.style('opacity',0)
    
            }
    
            var v5mousemove = function(e,d){
                tr =''
                tr += 'Selected Platform: ' + d.Platform + "<br/>"
                tr += 'Shared Titles With Other Platforms: <br/>'
                var has_edges = false
    
                for(let i in edges._groups[0]){
                    if (d.Platform == edges._groups[0][i].__data__.source.Platform){
                        has_edges = true
                        tr += edges._groups[0][i].__data__.target.Platform +' : ' + edges._groups[0][i].__data__.shared
                        if(edges._groups[0][i].__data__.index != edges._groups[0].length){
                            tr += '<br/>'
                        }
                    }
                    if (d.Platform == edges._groups[0][i].__data__.target.Platform){
                        has_edges = true
                        tr += edges._groups[0][i].__data__.source.Platform +' : ' + edges._groups[0][i].__data__.shared
                        if(edges._groups[0][i].__data__.index != edges._groups[0].length){
                            tr += '<br/>'
                        }
                    }
                }
    
    
                if(has_edges == false){
                    tr += 'This Platform does not share more than 1 title with any other Platform'
                }
    
                v5tip.html(tr)
                
                
                v5tip.style("left", (e.pageX-(parseInt(v5tip.style("width"))/2) - 5) + "px")
                .style("top", (e.pageY-(parseInt(v5tip.style("height")))-20)+ "px")
            }
            var nodes = v5svg.selectAll('.node').data(nldata.nodes).enter().append('circle')
            .attr('fill', 'blue')
            .attr('stroke','black')
            .attr('platform', (d) => d.Platform)
            .on('mouseover', v5mouseover)
            .on('mouseout', v5mouseout)
            .on('mousemove', v5mousemove)
            .attr('class','node')

            force.on('tick',function(){
                edges.attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y)
                .attr('stroke-width', d => wscale(d.shared))
        
                nodes.attr('cx', d=> d.x)
                .attr('cy', d => d.y)
                .attr('r', 6)    
            })

        })

        force.on('tick',function(){
            edges.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y)
            .attr('stroke-width', d => wscale(d.shared))
    
            nodes.attr('cx', d=> d.x)
            .attr('cy', d => d.y)
            .attr('r', 6)    
        })




    });
}
