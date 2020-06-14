let vm = new Vue({
  el: "#app",
  data: {
    url: "./cars.json",
    cars: null
  },
  mounted() {
    axios.get(this.url).then((res) => {
      this.cars = res.data;
    });
    this.yearChart();
  },
  computed: {
    yearList: function () {
      let el = this.cars;
      let year = new Array();
      let year_count = new Array();
      if (el) {
        el.forEach((e) => {
          if (year.includes(e.YEAR) != true) {
            year.push(e.YEAR);
            year_count.push({
              YEAR: e.YEAR,
              count: 1,
              Brand: [{ Brand: e.Make, count: 1 }],
              Make: [e.Make]
            });
          } else {
            for (let i in year_count) {
              if (e.YEAR == year_count[i].YEAR) {
                year_count[i].count += 1;
                if (year_count[i].Make.includes(e.Make)) {
                  year_count[i].Brand.count++;
                } else {
                  year_count[i].Make.push(e.Make);
                  year_count[i].Brand.push({ Brand: e.Make, count: 1 });
                }
              }
            }
          }
        });
      }
      return year_count;
    },
    kWList: function () {
      let el = this.cars;
      let Size = new Array();
      let SizeKW = new Array();
      if (el) {
        el.forEach((el) => {
          if (Size.includes(el.Size) != true) {
            Size.push(el.Size);
            SizeKW.push({
              Size: el.Size,
              kW: +el["(kW)"],
              count: 1,
              avg: +el["(kW"] / 1
            });
          } else {
            for (let i in SizeKW) {
              if (el.Size == SizeKW[i].Size) {
                SizeKW[i].count++;
                SizeKW[i].kW += +el["(kW)"];
                SizeKW[i].avg = +(SizeKW[i].kW / SizeKW[i].count).toFixed(1);
              }
            }
          }
        });
      }
      SizeKW.sort((a, b) => {
        return a.avg > b.avg ? 1 : -1;
      });
      return SizeKW;
    },
    brandList: function () {
      let el = this.cars;
      let Brand = new Array();
      let BrandCount = new Array();
      if(el){
        el.forEach((el) => {
          if (Brand.includes(el.Make) != true) {
            Brand.push(el.Make);
            BrandCount.push({ Brand: el.Make, BCount: 1 });
          } else {
            for (let i in BrandCount) {
              if (el.Make == BrandCount[i].Brand) {
                BrandCount[i].BCount++;
              }
            }
          }
        });
      }
      return BrandCount;
    }
  },

  method: {
    yearChart: function () {
      // 設定margin與寬高
      let margin = { top: 30, right: 30, bottom: 40, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
      // 新增主要區塊至頁面
      let svg = d3
        .select("#year")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      設定X軸
      let x = d3
        .scaleBand()
        .range([0, width])
        .domain(
          this.yearList.map(function (d) {
            return d.YEAR;
          })
        )
        .padding(0.7);
      svg
        .append("g")
        .attr("transform", "translate(0, " + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "translate(0, 0)")
        .style("text-anchor", "middle");
      //設定Y軸
      let y = d3.scaleLinear().domain([0, 20]).range([height, 0]);
      svg.append("g").call(d3.axisLeft(y));
      let div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
      // 新增資料
      svg
        .selectAll("my_bar")
        .data(this.yearList)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d["YEAR"]);
        })
        .attr("y", function (d) {
          return (20 - d.count) * (height / 20);
        })
        .attr("width", 20)
        .attr("height", function (d) {
          return (height / 20) * d.count;
        })
        .attr("fill", "#69b3a2")
        //hover效果
        .on("mouseover", function (d) {
          div.transition().duration(200).style("opacity", 0.9);
          div
            .html(newData.Brand[0].Brand + newData.Brand[0].count)
            .style("left", d3.event.pageX + "px")
            .style("top", d3.event.pageY - 28 + "px");
        })
        .on("mouseout", function (d) {
          div.transition().duration(500).style("opacity", 0);
        });
    }
  }
});
