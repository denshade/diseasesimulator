const HEALTHY = 0;
const IMMUNE = 1;
const DISEASED = 2;
const DECEASED = 3;

const days_infectious = 10;
const days_diseased = 10;

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

const stepData = (data) => 
{
    //spread disease
    const width = data.length;
    const height = data[0].length;
    spreadDisease(data, width, height);
    decreaseCounters(data, width, height);
    

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
    d.infectious_count_down = days_infectious;
    d.disease_count_down = days_diseased;
}

const spreadDisease = (data, width, height) => {
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
        }
    }
    var newData = Array(height).fill().map(() => Array(height).fill(HEALTHY));
    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (data[x][y].state != DISEASED) continue;
            if (data[x][y].state == IMMUNE) continue;
            if (x > 0 && y > 0) newData[x - 1][y - 1] = DISEASED;
            if ( y > 0) newData[x][y - 1] = DISEASED;
            if (x + 1 < width) newData[x + 1][y] = DISEASED;
            if (x + 1 < width && y > 0) newData[x + 1][y - 1] = DISEASED;
            if (x + 1 < width && y + 1 < height) newData[x + 1][y + 1] = DISEASED;
            if (y + 1 < height) newData[x][y + 1] = DISEASED;
            if (x > 0 && y + 1 < height) newData[x - 1][y + 1] = DISEASED;            

        }
    
    }

    for (var x = 0; x < width; x++)
    {
        for (var y = 0; y < height; y++)
        {
            if (data[x][y].state != DISEASED && newData[x][y] == DISEASED) {
                infect(data[x][y]);
            }
            //data[x][y].state = newData[x][y];    
        }
    
    }
}