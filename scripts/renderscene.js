let view;
let ctx;
let scene;
let start_time;

const LEFT =   32; // binary 100000
const RIGHT =  16; // binary 010000
const BOTTOM = 8;  // binary 001000
const TOP =    4;  // binary 000100
const FAR =    2;  // binary 000010
const NEAR =   1;  // binary 000001
const FLOAT_EPSILON = 0.000001;

// Initialization function - called when web page loads
function init() {
    let w = 800;
    let h = 600;
    view = document.getElementById('view');
    view.width = w;
    view.height = h;

    ctx = view.getContext('2d');

    // initial scene... feel free to change this
    scene = {
        view: {
            type: 'perspective',
            prp: Vector3(44, 20, -16),
            srp: Vector3(20, 20, -40),
            vup: Vector3(0, 1, 0),
            clip: [-19, 5, -10, 8, 12, 100]
        },
        models: [
            {
                type: 'generic',
                vertices: [
                    Vector4( 0,  0, -30, 1), // 0
                    Vector4(20,  0, -30, 1), // 1
                    Vector4(20, 12, -30, 1), // 2
                    Vector4(10, 20, -30, 1), // 3
                    Vector4( 0, 12, -30, 1), // 4
                    Vector4( 0,  0, -60, 1), // 5
                    Vector4(20,  0, -60, 1), // 6
                    Vector4(20, 12, -60, 1), // 7 
                    Vector4(10, 20, -60, 1), // 8
                    Vector4( 0, 12, -60, 1)  // 9
                ],
                edges: [
                    [0, 1, 2, 3, 4, 0], // [0,1] [1,2] [2,3] [3,4] [4,0]
                    [5, 6, 7, 8, 9, 5], // [5,6] [6,7] [7,8] [8,9] [9,5]
                    [0, 5], 
                    [1, 6],
                    [2, 7],
                    [3, 8],
                    [4, 9]
                ],
                matrix: new Matrix(4, 4)
            }
        ]
    };

    // event handler for pressing arrow keys
    document.addEventListener('keydown', onKeyDown, false);
    
    // start animation loop
    start_time = performance.now(); // current timestamp in milliseconds
    window.requestAnimationFrame(animate);


 /*
    Tested reference perspective model; Working properly
    let testPRP = new Vector3(0,10,-5);
    let testSRP = new Vector3(20,15,-40);
    let testVUP = new Vector3(1,1,0);
    let testClip = [-12,6,-12,6,10,100];
    let res = mat4x4Perspective(testPRP, testSRP, testVUP, testClip);
 */

}

// Animation loop - repeatedly calls rendering code
function animate(timestamp) {
    // step 1: calculate time (time since start)
    let time = timestamp - start_time;
    
    // step 2: transform models based on time
    // TODO: implement this!

    // step 3: draw scene
    drawScene();

    // step 4: request next animation frame (recursively calling same function)
    // (may want to leave commented out while debugging initially)
    // window.requestAnimationFrame(animate);
}

// Main drawing code - use information contained in variable `scene`
function drawScene() {
    console.log(scene);
    // TODO: implement drawing here!
    // For each model, for each edge
    let nPer = mat4x4Perspective(scene.view.prp, scene.view.srp, scene.view.vup, scene.view.clip);
    let mPer = mat4x4MPer();
    // equivalent to mPer * nPer
    let matrix = mPer.mult(nPer);
    let vertices = []; // array of all vertices
    
    //for vertices
    for (let i = 0; i < scene.models.length; i++){
        for (let j = 0; j < scene.models[i].vertices.length; j++) {
            vertices[j] = matrix.mult(scene.models[i].vertices[j]);
           // vertices[j] = scene.models[i].vertices[j].mult(matrix);
           console.log(vertices[j]);
        }
    }

    // For loop iterate and access all the given vertices
    // Use the given vertices and multiply it by matrix(mPer * nPer)
    for (let i = 0; i < scene.models.length; i++){
        for (let j = 0; j < scene.models[i].edges.length; j++) {
            for (let k = 0; k < scene.models[i].edges[j].length-1; k++) {
                //[0,1,2,3,4]
                let pt0 = scene.models[i].edges[j][k];
                let pt1 = scene.models[i].edges[j][k+1];
                //create line
                let line = {pt0: pt0, pt1: pt1};
                console.log(line);
                //clip
                console.log((-1*scene.view.clip[4]) / scene.view.clip[5]);
                let new_line = clipLinePerspective(line, (-1*scene.view.clip[4]) / scene.view.clip[5]);
                //drawLine(clipped.p1, clipped.p2)
                //console.log(new_line);
                let w1 = new_line.pt0[2];
                let w2 = new_line.pt1[2];
                drawLine(new_line.pt0[0]/w1, new_line.pt0[1]/w1, new_line.pt1[0]/w2, new_line.pt1[1]/w2);
                console.log(new_line.p1.x/w1);
            }
        }
    }

    /* How to create the line
    let pt0 = Vector3(2,2,2);
    let pt1 = Vector3(-5,10,20);
    let line = {pt0, pt1}; 
    clip(line, z_min)
    */

    //  * transform to canonical view volume    nPer
    //  * clip in 3D                            clip
    //  * project to 2D                        
    //  * draw line                             drawLine()

}

// Get outcode for vertex (parallel view volume)
function outcodeParallel(vertex) {
    let outcode = 0;
    if (vertex.x < (-1.0 - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (1.0 + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (-1.0 - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (1.0 + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (0.0 + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Get outcode for vertex (perspective view volume)
function outcodePerspective(vertex, z_min) {
    let outcode = 0;
    if (vertex.x < (vertex.z - FLOAT_EPSILON)) {
        outcode += LEFT;
    }
    else if (vertex.x > (-vertex.z + FLOAT_EPSILON)) {
        outcode += RIGHT;
    }
    if (vertex.y < (vertex.z - FLOAT_EPSILON)) {
        outcode += BOTTOM;
    }
    else if (vertex.y > (-vertex.z + FLOAT_EPSILON)) {
        outcode += TOP;
    }
    if (vertex.z < (-1.0 - FLOAT_EPSILON)) {
        outcode += FAR;
    }
    else if (vertex.z > (z_min + FLOAT_EPSILON)) {
        outcode += NEAR;
    }
    return outcode;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLineParallel(line) {
    let result = null;
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodeParallel(p0);
    let out1 = outcodeParallel(p1);
    
    // TODO: implement clipping here!

    return result;
}

// Clip line - should either return a new line (with two endpoints inside view volume) or null (if line is completely outside view volume)
function clipLinePerspective(line, z_min) {
    let result = null;
    let p0 = Vector3(line.pt0.x, line.pt0.y, line.pt0.z); 
    let p1 = Vector3(line.pt1.x, line.pt1.y, line.pt1.z);
    let out0 = outcodePerspective(p0, z_min);
    let out1 = outcodePerspective(p1, z_min);

    // Keep looping until case is either accept or reject
    while(true) {
        // Case 1: Trivial Accept. Return the line as it is
        if((out0 | out1) == 0) {
            result = line;
            break;
        }
        // Case 2: Trivial Reject. Return null
        else if((out0 & out1) != 0) {
            // Just break and do nothing since result was already initialize to null
            break;
        } else {
            // BOUNDS: LEFT = z, RIGHT = -z, BOTTOM y = z, TOP = -z, FAR z = 1, NEAR z = z_min
            let outcode = null;
            let x,y,z = null;
            let t = null;

            // At least one of the two outcode is != 0 meaning its vertex is outside the view volume.
            if(out0 != 0) {
                outcode = out0;
            } else {
                outcode = out1;
            }

            // Check via LEFT plane, calculate its new interception points and decrement outcode
            if(outcode & LEFT) {
                t = (-p0.x + p0.z) / ((p1.x - p0.x) - (p1.z - p0.z));

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= LEFT;
            }
            // Check via RIGHT plane, calculate its new interception points and decrement outcode
            else if(outcode & RIGHT) {
                                    // Flipped points for negative change in slope
                t = (p0.x + p0.z) / ((p0.x - p1.x) - (p0.z - p1.z));

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= RIGHT;

            }
            // Check via BOTTOM plane, calculate its new interception points and decrement outcode
            else if(outcode & BOTTOM) {
                t = (-p0.y + p0.z) / ((p1.y - p0.y) - (p1.z - p0.z));

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= BOTTOM;

            }
            // Check via TOP plane, calculate its new interception points and decrement outcode
            else if(outcode & TOP) {
                                    // Flipped points for negative change in slope
                t = (p0.y + p0.z) / ((p0.y - p1.y) - (p0.z - p1.z));

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= TOP;
            }
            // Check via FAR plane, calculate its new interception points and decrement outcode
            else if(outcode & FAR) {
                // Flipped points for negative change in slope
                t = (p0.z - z_min) / (p0.z- p1.z);

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= FAR;
            }
            // Check via NEAR plane, calculate its new interception points and decrement outcode
            else {
                t = (-p0.z - 1) / (p1.z- p0.z);

                x = ((1-t) * p0.x) + (t * p1.x);
                y = ((1-t) * p0.y) + (t * p1.y);
                z = ((1-t) * p0.z) + (t * p1.z);

                outcode -= NEAR;
            }

            // Check if outcode is out0, if so change out0 to become the new outcode
            // and its p0 to the new (x,y,z)
            if(outcode == out1) {
                p0.x = x;
                p0.y = y;
                p0.z = z;
                out0 = outcode;
            }
            // Else, it do the same but for out1
            else {
                p1.x = x;
                p1.y = y;
                p1.z = z;
                out1 = outcode;
            }

            line.pt0 = p0;
            line.pt1 = p1;
            result = line;
        }
    }

    return result;
}

// Called when user presses a key on the keyboard down 
function onKeyDown(event) {
    switch (event.keyCode) {
        case 37: // LEFT Arrow
            console.log("left");
            break;
        case 39: // RIGHT Arrow
            console.log("right");
            break;
        case 65: // A key
            console.log("A");
            break;
        case 68: // D key
            console.log("D");
            break;
        case 83: // S key
            console.log("S");
            break;
        case 87: // W key
            console.log("W");
            break;
    }
}

///////////////////////////////////////////////////////////////////////////
// No need to edit functions beyond this point                           //
///////////////////////////////////////////////////////////////////////////

// Called when user selects a new scene JSON file
function loadNewScene() {
    let scene_file = document.getElementById('scene_file');

    console.log(scene_file.files[0]);

    let reader = new FileReader();
    reader.onload = (event) => {
        scene = JSON.parse(event.target.result);
        scene.view.prp = Vector3(scene.view.prp[0], scene.view.prp[1], scene.view.prp[2]);
        scene.view.srp = Vector3(scene.view.srp[0], scene.view.srp[1], scene.view.srp[2]);
        scene.view.vup = Vector3(scene.view.vup[0], scene.view.vup[1], scene.view.vup[2]);

        for (let i = 0; i < scene.models.length; i++) {
            if (scene.models[i].type === 'generic') {
                for (let j = 0; j < scene.models[i].vertices.length; j++) {
                    scene.models[i].vertices[j] = Vector4(scene.models[i].vertices[j][0],
                                                          scene.models[i].vertices[j][1],
                                                          scene.models[i].vertices[j][2],
                                                          1);
                }
            }
            else {
                scene.models[i].center = Vector4(scene.models[i].center[0],
                                                 scene.models[i].center[1],
                                                 scene.models[i].center[2],
                                                 1);
            }
            scene.models[i].matrix = new Matrix(4, 4);
        }
    };
    reader.readAsText(scene_file.files[0], 'UTF-8');
}

// Draw black 2D line with red endpoints 
function drawLine(x1, y1, x2, y2) {
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.fillStyle = '#FF0000';
    ctx.fillRect(x1 - 2, y1 - 2, 4, 4);
    ctx.fillRect(x2 - 2, y2 - 2, 4, 4);
}
