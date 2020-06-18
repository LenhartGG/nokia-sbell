<template>
  <div class="map">
    <div v-show="!loading" class="chart" ref="parentChart"

    ></div>
    <!-- <div v-show="true" class="chart" ref="parentChart"

    ></div> -->
    <section v-show="loading" class="spin_section">
        <Spin class="spin" size="large"></Spin>
    </section>
  </div>
    
</template>

<script>
// @ is an alias to /src
import * as d3 from 'd3'
import { Spin } from "iview";
import { mrByMR } from '@/request/api.js';

export default {
  props:['chartlist'],
  data(){
      return{
        svg:'',
        list:[],
        loading:false
      }
  },
  created() {
      this.loading = false;
      let query = this.$route.query;
      let key = query.key;
      let count = parseInt(query.count);
      if(key && count > 0){
        var options = { key: key, count: count };
        this.loading = true;
        // this.createMapModel();
        mrByMR(options)
            .then((result) => {
              this.loading = false;
              this.createMap(result.data.result);            
            }).catch((err) => {
              this.loading = false;
              this.createMapModel();
            });
      }else{
        if(this.list.length > 0){
          this.drawMap(list)
        }else{
          this.createMapModel();      
        }
      }
  },
  mounted() {},
  components: {Spin},
  methods:{
    setData (err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    },
    random(n,m){
      var c = m-n+1;  
      return Math.floor(Math.random() * c + n);
    },
    createMapModel(){
      this.drawMap({'inner':[],'outer':[],'links':[]})
    },
    createMap(arr){      
      this.list = this.parseData(arr);
      this.drawMap(this.list);      
    },
    parseData(arr) {
        console.log('parseData');
        console.log(arr);
        
        // var data = arr;
        var data = arr.slice(0,44)
        var outer = d3.map();
        var inner = [];
        var links = [];

        var limitLabelCount = 10;

        var link_width = "1px"; 

        // var diameter = 900;
        // var rect_width = 100;
        // var rect_height = 20;

        var diameter = 1300;
        var rect_width = 100;
        var rect_height = 20;
        console.log('source1');

        data.forEach(element => {
          var temp = [];
          var labels = element.labels;
          labels.forEach(ele => {
            if(temp.length <= limitLabelCount){
              temp.push(ele);
            }
          });
          element.label=temp
        });      
        var outerId = [0];  
        console.log('source2');

        //整理数据成关系图所需的样式
        var source = [];
        data.forEach(function(d){
          source.push([d.key,d.label])
        });

        console.log('source3');
        console.log(source);
        source.forEach(function(d){       
          if (d == null)
              return;
          
          var i = { id: 'i' + inner.length, name: d[0], related_links: [] };
          i.related_nodes = [i.id];
          inner.push(i);
          
          if (!Array.isArray(d[1]))
              d[1] = [d[1]];

          d[1].forEach(function(d1){          
              var o = outer.get(d1);          
              if (o == null){
                o = { name: d1,	id: 'o' + outerId[0], related_links: [] };
                o.related_nodes = [o.id];
                outerId[0] = outerId[0] + 1;	
                
                outer.set(d1, o);
              }
              
              // create the links
              var l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
              links.push(l);
              
              // and the relationships
              i.related_nodes.push(o.id);
              i.related_links.push(l.id);
              o.related_nodes.push(i.id);
              o.related_links.push(l.id);
          });
        });

        data = {
          inner: inner,
          outer: outer.values(),
          links: links
        }

        // sort the data -- TODO: have multiple sort options
        outer = data.outer;
        data.outer = Array(outer.length);


        var i1 = 0;
        var i2 = outer.length - 1;

        for (var i = 0; i < data.outer.length; ++i)
        {
          if (i % 2 == 1)
              data.outer[i2--] = outer[i];
          else
              data.outer[i1++] = outer[i];
        }

        var il = data.inner.length;
        var ol = data.outer.length;

        var inner_y = d3.scale.linear()
          .domain([0, il])
          .range([-(il * rect_height)/2, (il * rect_height)/2]);

        var mid = (data.outer.length/2.0)
        var outer_x = d3.scale.linear()
          .domain([0, mid, mid, data.outer.length])
          .range([15, 170, 190 ,355]);

        var outer_y = d3.scale.linear()
          .domain([0, data.outer.length])
          .range([0, diameter / 2 - 120]);
        

        // setup positioning
        data.outer = data.outer.map(function(d, i) { 
          d.x = outer_x(i);
          d.y = diameter/3;
          return d;
        });

        data.inner = data.inner.map(function(d, i) { 
          d.x = -(rect_width / 2);
          d.y = inner_y(i);
          return d;
        });
        return  data;
      },
    mouseover(d){
        var green = "#7ebc59" //green
        var white = "#ffffff" //white  
        // bring to front
        d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
        
        for (var i = 0; i < d.related_nodes.length; i++){
            if( d.related_nodes[0].startsWith('i')){//鼠标悬停于中间MR号
              d3.select('#' + d.related_nodes[0]).classed('highlight', true).attr("font-weight", 'bold').style("fill", green);
              d3.select('#' + d.related_nodes[0] + '-txt').style("fill", white);
              
              d3.select('#' + d.related_nodes[i+1]).classed('highlight', true).style("fill", green);
              d3.select('#' + d.related_nodes[i+1]+ '-txt').attr("font-weight", 'bold').style("fill", green);
            }else if( d.related_nodes[0].startsWith('o')){//鼠标悬停于外圈MR号
              d3.select('#' + d.related_nodes[0] + '-txt').style("fill", green);
              d3.select('#' + d.related_nodes[0]).classed('highlight', true).attr("font-weight", 'bold').style("fill", green);

              d3.select('#' + d.related_nodes[i+1]).classed('highlight', true).style("fill", green);
              d3.select('#' + d.related_nodes[i+1]+ '-txt').attr("font-weight", 'bold').style("fill", white);
            }
        }
        
        for (var i = 0; i < d.related_links.length; i++){
            d3.select('#' + d.related_links[i]).attr('stroke-width', '2px').style("stroke",green);
        }
    },
    mouseout(d){   	
      var grey = "#eaeaea" //grey
      var black = "#000000" //grey
      var link_width = "1px"; 
      for (var i = 0; i < d.related_nodes.length; i++){
          d3.select('#' + d.related_nodes[i]).classed('highlight', false).style("fill",grey);
          d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal').style("fill", black);      
      }
      
      for (var i = 0; i < d.related_links.length; i++)
          d3.select('#' + d.related_links[i]).attr('stroke-width', link_width).style("stroke",grey);
    },    
    drawMap(data){      
        this.clearChart()
        var grey = "#eaeaea" //grey
        // var diameter = 900;
        // var rect_height = 20;
        // var rect_width = 100;
        var diameter = 1000;
        var rect_height = 20;
        var rect_width = 100;

        var link_width = "1px"; 
          var diagonal = d3.svg.diagonal()
            .source(function(d) { 
                return {"x": d.outer.y * Math.cos(projectX(d.outer.x)), 
                        "y": -d.outer.y * Math.sin(projectX(d.outer.x))}; })
            .target(function(d) { 
                return {"x": d.inner.y + rect_height/2,
                        "y": d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width}; })
            .projection(function(d) { return [d.y, d.x]; });
    
          var svg = d3.select(".chart").append("svg")
            .attr("id","svgmap")
            .attr("class",".svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .append("g")
            .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
            
    
          // links
          var link = svg.append('g').attr('class', 'links').selectAll(".link")
            .data(data.links)
            .enter().append('path')
            .attr('class', 'link')
            .attr('id', function(d) { return d.id })
            .attr("d", diagonal)
            .attr('stroke', function(d) { return '#dddddd'; })
            .attr('stroke-width', link_width);
    
          // outer nodes
          var onode = svg.append('g').selectAll(".outer_node")
            .data(data.outer)
          .enter().append("g")
            .attr("class", "outer_node")
            .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
            .on("mouseover", this.mouseover)
            .on("mouseout", this.mouseout);
          
          onode.append("circle")
            .attr('id', function(d) { return d.id })
            .attr("r", 4.5);
          
          onode.append("circle")
            .attr('r', 20)
            .attr('visibility', 'hidden');
          
          onode.append("text")
            .attr('id', function(d) { return d.id + '-txt'; })
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
            .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
            .text(function(d) { return d.name; });
          
          // inner nodes
          
          var inode = svg.append('g').selectAll(".inner_node")
            .data(data.inner)
          .enter().append("g")
            .attr("class", "inner_node")
            .attr("transform", function(d, i) { return "translate(" + d.x + "," + (d.y) + ")"})
            .on("mouseover", this.mouseover)
            .on("mouseout", this.mouseout);
          
          inode.append('rect')
            .attr('width', rect_width)
            .attr('height', rect_height)
            .attr('id', function(d) { return d.id; })
            .style('fill', grey);
          
          inode.append("text")
            .attr('id', function(d) { return d.id + '-txt'; })
            .attr('text-anchor', 'middle')
            .attr("transform", "translate(" + rect_width/2 + ", " + rect_height * .75 + ")")
            .text(function(d) { return d.name; });
    
          // need to specify x/y/etc
    
          d3.select(self.frameElement).style("height", diameter - 150 + "px");

          function     projectX(x){
            return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
          }
      },
      clearChart(){
        //TODO:待完成
        this.list = [];
        // var chart  = d3.select('chart');
        // d3.selectAll("svg > *").remove(); // 移除svg内部节点
        // d3.selectAll("svg").remove();	// 移除svg节点
        // this.$refs.parentChart.innerHTML = '';

        d3.select('#svgmap').remove();   //删除整个SVG
        d3.select('#svgmap')
          .selectAll('*')
          .remove();                    //清空SVG中的内容
      }    
  }
};
</script>

<style >
.map .chart .spin_section .ivu-spin-large .ivu-spin-dot{
    width: 50px;
    height: 50px;
}

.map .spin{
    width: 50px;
    position: relative;
    top: 400px;
    left: 500px;
    filter:alpha(Opacity=80);
    -moz-opacity:0.5;
    opacity: 0.5;
    z-index:100; 
    background-color:transparent;
}

.map .chart svg {
    font: 12px sans-serif;
}

.map .chart text {
    pointer-events: none;
}

.map .chart .inner_node{
    font-size: 14px;
}

.map .chart .outer_node{
    font-size: 16px;
}

.map .chart .inner_node rect {
    pointer-events: all;
}

.map .chart .inner_node rect.highlight {
    stroke: #4aa15c;
    stroke-width: 2px;
}

.map .chart .outer_node circle {
    fill: #DDDDDD;
    /* stroke: black; */
    /* stroke-width: 1.5px; */
    pointer-events: all;
}

.map .chart .outer_node circle.highlight
{
    stroke: #4aa15c;
    stroke-width: 2px;
}

.map .chart .link {
    fill: none;
}

.map .chart{
  margin: 0 auto;
}

.map .chart .svg{

}

.map{
  margin: 0 auto;
  margin-top: 20px;
  height: 1100px;
  width: 1000px;
}
</style>