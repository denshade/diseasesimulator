const HEALTHY = 0;
const IMMUNE = 1;
const DISEASED = 2;
const DECEASED = 3;

const healthyObj = {
    state : HEALTHY,
    disease_count_down : 0,
    infectious_count_down : 0,
    immune_count_down : 0
  }

const drawData = (data) => 
{
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    /*
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imgdata = imageData.data;
    for (var i = 0; i < imgdata.length; i += 4) {
        const colorIndex = i / 4;
        const cx = colorIndex % canvas.width;
        const cy = Math.floor(colorIndex / canvas.width);
        
        let r = g = b = 0;
        
        switch(data[cx][cy].state)
        {
            case HEALTHY: g = 255;break;
            case DISEASED: r = 255;break;
            case IMMUNE: g = b = 255;break;
            case DECEASED: r = g = b = 0;break;
            default : r = g = b = 128; 
        }
        

        imgdata[i]     = r;     // red
        imgdata[i + 1] = g; // green
        imgdata[i + 2] = b; // blue
    }
    ctx.putImageData(imageData,0,0);
    */
    for (var x = 0; x < data.length; x++)
      for (var y = 0; y < data[x].length; y++)
      {
        switch(data[x][y].state)
        {
            case HEALTHY: ctx.fillStyle = "#00FF00";break;
            case DISEASED: ctx.fillStyle = "#FF0000";break;
            case IMMUNE: ctx.fillStyle = "#00FFFF";break;
            case DECEASED: ctx.fillStyle = "#000000";break;
        }
        ctx.fillRect(x, y, 1, 1);
      }
}

const clearData = () => 
{
    var data = [];
    for (var x = 0; x < width; x++)
    {
      var dataRow = [];
      for (var y = 0; y < height; y++)
      {
        dataRow.push({...healthyObj});
      }
      data.push(dataRow);
    }
    data[width/2][height/2].state = DISEASED;
    return data;
}

const clearExistingData = (data, width, height) => 
{
    for (var x = 0; x < data.length; x++)
    {
      for (var y = 0; y < data[0].length; y++)
      {
          data[x][y].state = HEALTHY;
      }
    }
    data[width/2][height/2].state = DISEASED;
}

const stepData = (data, stepData) => 
{
    //spread disease
    const width = data.length;
    const height = data[0].length;
    spreadDisease(data, width, height);
    decreaseCounters(data, width, height);
    stepData.push([++step, [].concat.apply([], data).map(e => e.state).filter(e => e == DISEASED).length,[].concat.apply([], data).map(e => e.state).filter(e => e == DECEASED).length]);
}

const decreaseCounters = (data, width, height) => {
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            let o = data[x][y];
            if (o.disease_count_down > 0)
                o.disease_count_down--;
            if (o.infectious_count_down > 0)
                o.infectious_count_down--;
            if (o.disease_count_down == 0 && o.state == DISEASED) 
            {
                o.state = IMMUNE;
            }
        }
    }
}

const infect = (d) => {
    d.state = DISEASED;
    d.infectious_count_down = document.getElementById("infectious").value;;
    d.disease_count_down = document.getElementById("diseased").value;;
}

const spreadIfHealthy = (state) => state == HEALTHY ? DISEASED : state;
const spreadDisease = (data, width, height) => {
    let newData = [];
    for (var x = 0; x < width; x++)
    {
        newDataRow = [];
        for (var y = 0; y < height; y++)
        {
            newDataRow.push(data[x][y].state);
        }
        newData.push(newDataRow);
    }
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (data[x][y].state != DISEASED) continue;
            if (data[x][y].state == IMMUNE) continue;
            if (x > 0 && y > 0) newData[x - 1][y - 1] = spreadIfHealthy(newData[x - 1][y - 1]);
            if ( y > 0) newData[x][y - 1] = spreadIfHealthy(newData[x][y - 1]);
            if (x + 1 < width) newData[x + 1][y] = spreadIfHealthy(newData[x + 1][y]);
            if (x + 1 < width && y > 0) newData[x + 1][y - 1] = spreadIfHealthy(newData[x + 1][y - 1]);
            if (x + 1 < width && y + 1 < height) newData[x + 1][y + 1] = spreadIfHealthy(newData[x + 1][y + 1]);
            if (y + 1 < height) newData[x][y + 1] = spreadIfHealthy(newData[x][y + 1]);
            if (x > 0 && y + 1 < height) newData[x - 1][y + 1] = spreadIfHealthy(newData[x - 1][y + 1]);            

        }
    
    }

    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (data[x][y].state != DISEASED && newData[x][y] == DISEASED) {
                infect(data[x][y]);
            }
        }
    
    }
}


function drawChart() {
    var data = google.visualization.arrayToDataTable(chartdata);

    var options = {
      title: 'Disease progression',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
  }