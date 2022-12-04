class Main{
    #cellsize;
    #FPS;
    #mesh_color;
    #cell_color;


    constructor(){
        // canvas and ctx
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        // grid and cells
        this.#mesh_color = "black";
        this.#cell_color = "green";
        this.grid = [];
        this.#cellsize = document.getElementById("cellsize").value;

        // about FPS
        this.#FPS = 30;

        this.#set(); // set canvas width, height, rows, cols, fill grid
        this.#reset(); // reset everything when resize the window or change the cellsize
        this.#randomGrid(); // when press the random button make a new grid every time it pressed
    }


    #set(){
        // set canvas width, height according to the clientWidth, clientHeight;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // width and height
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // rows and columns
        this.rows = Math.floor(this.height / this.#cellsize);
        this.cols = Math.floor(this.width / this.#cellsize);

        // fill the grid
        this.#fillGrid();
    }


    #reset(){

        // reset all when window is resize( reset canvas width, height, rows, cols, grid)
        window.addEventListener("resize", () => {
            this.#set();
        })

        // change the cellsize according to the select tag value
        // then reset all ( reset canvas width, height, rows, cols, grid)
        document.getElementById("cellsize").addEventListener("change", e => {
            this.#set();
        })
    }


    #fillGrid(){
        this.grid = []; // delete all the cells from the grid

        for (let j = 0; j < this.rows; j++)
        {
            let row = [];
            for (let i = 0; i < this.cols; i++)
            {
                row.push(Math.floor(Math.random() * 2));
            }

            this.grid.push(row);
        }
    }


    #randomGrid(){
        document.getElementById("random").addEventListener("click", () => {
            this.#fillGrid();
        })
    }


    #drawMesh(){
        // horizental lines

        this.ctx.strokeStyle = this.#mesh_color;
        for (let j = 0; j < this.rows + 1; j++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, j * this.#cellsize);
            this.ctx.lineTo(this.width, j * this.#cellsize);
            this.ctx.stroke();
            this.ctx.closePath()
        }

        // vertical lines
        for(let i = 0; i < this.cols + 1; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.#cellsize, 0);
            this.ctx.lineTo(i * this.#cellsize, this.height);
            this.ctx.stroke();
            this.ctx.closePath()
        }
    }


    #drawCells(){
        this.ctx.fillStyle = this.#cell_color; // cet the ctx fillColor to cell color

        // draw live cells
        for (let j = 0; j < this.rows; j++)
        {
            for (let i = 0; i < this.cols; i++)
            {
                if (this.grid[j][i] == 1) this.ctx.fillRect(i * this.#cellsize, j * this.#cellsize, this.#cellsize, this.#cellsize);
            }
        }
    }


    #animate(timestamp){
        this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen
        this.#drawCells();
        this.#drawMesh();
        requestAnimationFrame(this.#animate.bind(this));
    }


    run(){
        this.#animate(0);
    }
}


let main = new Main();
main.run();