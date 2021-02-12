// cs-sketch.js; P5 key animation fcns.  // CF p5js.org/reference
// Time-stamp: <2020-02-02 15:58:23 Chuck Siska>
let SET_COUNT_MODE = false;
let COUNTDOWN_TIMER = 0;

/**
 * blue becomes red
 * red becomes yellow
 * yellow becomes black - has to loop back around
 */
let colorHash = {
    0: '#009', //BLUE
    1: '#900', //RED
    2: '#ff0', //YELLOW
    3: '#000' //BLACK
};

let colorIndex = {
    BLUE: 0, // TURN LEFT
    RED: 1, // TURN RIGHT
    YELLOW: 2, // GO STRAIGHT
    BLACK: 3 // TURN LEFT
};
// clockwise-direction
let noseDir = {
    NORTH: 0, // UP
    EAST: 1, // RIGHT
    SOUTH: 2, // DOWN
    WEST: 3 // LEFT
};
// Make global g_canvas JS 'object': a key-value 'dictionary'.
let g_canvas = { cell_size:10, wid:60, hgt:40 }; // JS Global var, w canvas size info.
let g_frame_cnt = 0; // Setup a P5 display-frame counter, to do anim
let g_frame_mod = 1; // Update ever 'mod' frames.
let g_stop = 0; // Go by default.

const sz = g_canvas.cell_size;
const sz2 = sz / 2;

function setup() // P5 Setup Fcn
{
    let sz = g_canvas.cell_size;
    let width = sz * g_canvas.wid;  // Our 'canvas' uses cells of given size, not 1x1 pixels.
    let height = sz * g_canvas.hgt;
    createCanvas( width, height );  // Make a P5 canvas.
    draw_grid( 10, 50, 'white', 'yellow' );
}

/** Change color here for initial coloring of cell and also direction of bot to move in - initial x,y of bot set*/
let g_bot = { dir:noseDir.NORTH, x:30, y:20, color:colorIndex.BLACK };
let g_box = { t:1, hgt:40, l:1, wid:60 }; // Box in which bot can move.

/**
 * turnRight/turnLeft functions called based on bot movement to cell
 */
let turnRight = () => {
    g_bot.dir++;
    if (g_bot.dir > noseDir.WEST) {
        g_bot.dir = noseDir.NORTH;
    }
}

let turnLeft = () => {
    g_bot.dir--;
    if (g_bot.dir < noseDir.NORTH) {
        g_bot.dir = noseDir.WEST;
    }
}

/**
 * Function to change x,y position for bot based on nose direction
 */
let moveForward = () => {
    if (g_bot.dir === noseDir.NORTH) {
        g_bot.y--;
    } else if (g_bot.dir === noseDir.EAST) {
        g_bot.x++;
    } else if (g_bot.dir === noseDir.SOUTH) {
        g_bot.y++;
    } else if (g_bot.dir === noseDir.WEST) {
        g_bot.x--;
    }
    g_bot.x = (g_bot.x + g_box.wid) % g_box.wid;
    g_bot.y = (g_bot.y + g_box.hgt) % g_box.hgt;
}

/**
 * Function for setCountMode
 */
let setCountMode = () => {
    // If countdown timer not set yet in set count mode, then move forward 1 more and then set timer to current color index
    if (COUNTDOWN_TIMER === 0) {
        moveForward();
        // Set countdown timer to current color index after move forward
        COUNTDOWN_TIMER = checkCellColor();
    } else {
        // if already in set count mode, then move forward no change in direction
        while (COUNTDOWN_TIMER > 0) {
            draw_bot();
            moveForward();
            COUNTDOWN_TIMER--;
        }
        // Countdown timer set back at 0 so set count mode back to false and resume LR mode
        SET_COUNT_MODE = false;
    }
}

function move_bot() {
    // Check what the current cell color is and draw cell color at the x,y position
    g_bot.color = checkCellColor();
    draw_bot();
    // if set count mode is true then call setCountMode
    if (SET_COUNT_MODE) {
        // Want to call function to let bot run while in this mode to either set countdown timer or have bot run straight with current cell color index
        setCountMode();
        // return here as we do not need to do anything else with bot movement based on color index while in this mode, so skip bottom statement
        return;
    }
    // switch state of cells based on current colorIndex
    switch (g_bot.color) {
        case 0: {
            // Blue cell means turn left
            turnLeft();
            moveForward();
            break;
        }
        case 1: {
            // Bot will turn right on red cell
            turnRight();
            moveForward();
            break;
        }
        case 2: {
            // Enter set count mode on yellow and move forward 1
            if (!SET_COUNT_MODE) {
                SET_COUNT_MODE = true;
            }
            moveForward();
            break;
        }
        case 3: {
            // Bot will turn left on black cell and then we move forward
            turnLeft();
            moveForward();
            break;
        }
    }
}

// Check the current color of the cell to direct bot movement and draw color
let checkCellColor = () => {
    // make global constants/variables when cleaning up
    let x = 1+ g_bot.x * sz; // Set x one pixel inside the sz-by-sz cell.
    let y = 1+ g_bot.y * sz;
    // console.log( "x,y,big = " + x + "," + y);

    // Get cell interior pixel color [RGBA] array.
    let acolors = get( x + sz2, y + sz2 );
    let red = acolors[0];
    let green = acolors[1];
    let blue = acolors[2];
    // let pix = red + green + blue;
    // console.log( "acolors,pix = " + acolors + ", " + pix );
    if (red && green) {
        return colorIndex.YELLOW;
    } else if (blue) {
        return colorIndex.BLUE;
    } else if (red) {
        return colorIndex.RED;
    } else {
        return colorIndex.BLACK;
    }
}

// Convert bot pox to grid pos & draw bot.
function draw_bot()
{
    console.log('DRAW THE BOT COLOR ');
    let x = 1+ g_bot.x*sz; // Set x one pixel inside the sz-by-sz cell.
    let y = 1+ g_bot.y*sz;
    let big = sz - 2; // Stay inside cell walls.
    // stroke( 'white' ); // bot visiting this cell
    // Fill 'color': its a keystring, or a hexstring like "#5F", etc.  See P5 docs.
    if (g_bot.color === 3) {
        fill(colorHash[0]);
        stroke(colorHash[0]);
    } else {
        fill(colorHash[g_bot.color+1]);
        stroke(colorHash[g_bot.color+1]);
    }

    // Paint the cell.
    rect( x, y, big, big );
}

function draw_update()  // Update our display.
{
    // console.log( "g_frame_cnt = " + g_frame_cnt );
    move_bot();
    // draw_bot( );
}

function draw()  // P5 Frame Re-draw Fcn, Called for Every Frame.
{
    ++g_frame_cnt;
    if (0 === g_frame_cnt % g_frame_mod)
    {
        if (!g_stop) draw_update();
    }
}

function keyPressed( )
{
    g_stop = !g_stop;
}

function mousePressed( )
{
    let x = mouseX;
    let y = mouseY;
    // console.log( "mouse x,y = " + x + "," + y );
    // let sz = g_canvas.cell_size;
    let gridx = round( (x-0.5) / sz );
    let gridy = round( (y-0.5) / sz );
    // console.log( "grid x,y = " + gridx + "," + gridy );
    // console.log( "box wid,hgt = " + g_box.wid + "," + g_box.hgt );
    g_bot.x = gridx + g_box.wid; // Ensure its positive.
    // console.log( "bot x = " + g_bot.x );
    g_bot.x %= g_box.wid; // Wrap to fit box.
    g_bot.y = gridy + g_box.hgt;
    // console.log( "bot y = " + g_bot.y );
    g_bot.y %= g_box.hgt;
    // console.log( "bot x,y = " + g_bot.x + "," + g_bot.y );
    // draw_bot( );
}
