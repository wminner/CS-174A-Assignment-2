// *******************************************************
// CS 174a Graphics Example Code
// animation.js - The main file and program start point.  The class definition here describes how to display an Animation and how it will react to key and mouse input.  Right now it has 
// very little in it - you will fill it in with all your shape drawing calls and any extra key / mouse controls.  

// Now go down to display() to see where the sample shapes are drawn, and to see where to fill in your own code.

"use strict"
var canvas, canvas_size, gl = null, g_addrs,
movement = vec2(), thrust = vec3(), looking = false, prev_time = 0, animate = true, animation_time = 0;
var gouraud = false, color_normals = false, solid = false;

		
// *******************************************************	
// When the web page's window loads it creates an Animation object, which registers itself as a displayable object to our other class GL_Context -- which OpenGL is told to call upon every time a
// draw / keyboard / mouse event happens.

window.onload = function init() {	var anim = new Animation();	}
function Animation()
{
	( function init (self) 
	{
		self.context = new GL_Context( "gl-canvas" );
		self.context.register_display_object( self );
		
		gl.clearColor(221 / 255, 243 / 255, 254 / 255, 1);   // Background color

		self.color_body = vec4(248 / 255, 160 / 255, 216 / 255);
		self.color_foot = vec4(248 / 255, 24 / 255, 128 / 255, 1);
		self.color_blush = vec4(248 / 255, 52 / 255, 146 / 255);

		self.basis_stack = []; 	                        // Create stack to store basis
		self.ground_stack = [];                         // Create stack to store ground

	    // Initialize music
		self.music = new Audio('Green_Greens.mp3');
		
	    // Initialize level assets
		self.m_ground = new cube(3, 35);
		self.m_background1 = new cube(1, 20);
		self.m_background2 = new cube(1, 20);
		self.m_theend = new cube(1, 1);

	    // Initialize mushroom trunk
		self.num_spheres = 3;
		self.m_stem = [];
		for (var i = 0; i < self.num_spheres; i++) {		// Make cubes for mushroom trunk
		    if (i == 0)
		        self.m_stem[i] = new half_sphere(mat4(), 4);
            else
		        self.m_stem[i] = new sphere(mat4(), 4);
		}
	    // Initialize mushroom top
		self.m_mushtop = new half_sphere(mat4(), 4);
		self.m_mushtop2 = new pyramid(mat4(), 4);

	    // Initialize box
		self.m_block = new Array(6);
		for (var k = 0; k < 6; k++)
		    self.m_block[k] = new cube(1, 1);
		
		// Initialize Kirby
		self.m_body = new sphere(mat4(), 4, 1);
		self.m_arml = new sphere(mat4(),4);
		self.m_armr = new sphere(mat4(),4);
		self.m_footl = new sphere(mat4(),4);
		self.m_footr = new sphere(mat4(), 4);
		self.m_eyel = new Array(2);
		self.m_eyer = new Array(2);
		for (var j = 0; j < 2; j++) {   // Index 0 outer eye, 1 pupil
		    self.m_eyel[j] = new sphere(mat4(), 4);
		    self.m_eyer[j] = new sphere(mat4(), 4);
		}
		self.m_mouth = new Array(3);
		for (var i = 0; i < 3; i++) {   // Index 0 mouth line, 1 left cheek line, 2 right cheek line
		    self.m_mouth[i] = new sphere(mat4(), 4);
		}
		self.m_cheekl = new sphere(mat4(), 4);
		self.m_cheekr = new sphere(mat4(), 4);
		self.m_blushl = new sphere(mat4(), 4);
		self.m_blushr = new sphere(mat4(), 4);
		
		var vec_eye = vec3(0, 10, 40);      // Initial camera position
		var vec_at = vec3(0, 4, 0);
		var vec_up = vec3(0, 1, 0);

		self.camera_transform = lookAt(vec_eye, vec_at, vec_up);

		self.projection_transform = perspective(45, canvas.width / canvas.height, .1, 400);		// The matrix that determines how depth is treated.  It projects 3D points onto a plane.
		
		gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);		gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);		gl.uniform1i( g_addrs.SOLID_loc, solid);
		
		self.animation_time = 0;
		self.animation_delta_time = 0;
		self.animation_duration = 0;
		self.chooseAnim = 0;
		self.levelstart = -105;       // -150
		self.mushroomAttack = 0;
		self.theEnd = 0;
		self.context.render();
	} ) ( this );	
	
	//canvas.addEventListener('mousemove', function(e)	{		e = e || window.event;		movement = vec2( e.clientX - canvas.width/2, e.clientY - canvas.height/2, 0);	});
}

// *******************************************************	
// init_keys():  Define any extra keyboard shortcuts here
 Animation.prototype.init_keys = function()
 {
	// shortcut.add( "Space", function() { thrust[1] = -1; } );			shortcut.add( "Space", function() { thrust[1] =  0; }, {'type':'keyup'} );
	// shortcut.add( "z",     function() { thrust[1] =  1; } );			shortcut.add( "z",     function() { thrust[1] =  0; }, {'type':'keyup'} );
	// shortcut.add( "w",     function() { thrust[2] =  1; } );			shortcut.add( "w",     function() { thrust[2] =  0; }, {'type':'keyup'} );
	// shortcut.add( "a",     function() { thrust[0] =  1; } );			shortcut.add( "a",     function() { thrust[0] =  0; }, {'type':'keyup'} );
	// shortcut.add( "s",     function() { thrust[2] = -1; } );			shortcut.add( "s",     function() { thrust[2] =  0; }, {'type':'keyup'} );
	// shortcut.add( "d",     function() { thrust[0] = -1; } );			shortcut.add( "d",     function() { thrust[0] =  0; }, {'type':'keyup'} );
	// shortcut.add( "f",     function() { looking = !looking; } );
	// shortcut.add( ",",     ( function(self) { return function() { self.camera_transform = mult( rotate( 3, 0, 0,  1 ), self.camera_transform ); }; } ) (this) ) ;
	// shortcut.add( ".",     ( function(self) { return function() { self.camera_transform = mult( rotate( 3, 0, 0, -1 ), self.camera_transform ); }; } ) (this) ) ;

	// shortcut.add( "r",     ( function(self) { return function() { self.camera_transform = mat4(); }; } ) (this) );
	// shortcut.add( "ALT+s", function() { solid = !solid;					gl.uniform1i( g_addrs.SOLID_loc, solid);	
																		// gl.uniform4fv( g_addrs.SOLID_COLOR_loc, vec4(Math.random(), Math.random(), Math.random(), 1) );	 } );
	// shortcut.add( "ALT+g", function() { gouraud = !gouraud;				gl.uniform1i( g_addrs.GOURAUD_loc, gouraud);	} );
	// shortcut.add( "ALT+n", function() { color_normals = !color_normals;	gl.uniform1i( g_addrs.COLOR_NORMALS_loc, color_normals);	} );
	// shortcut.add( "ALT+a", function() { animate = !animate; } );
	
	// shortcut.add( "p",     ( function(self) { return function() { self.m_axis.basis_selection++; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );
	// shortcut.add( "m",     ( function(self) { return function() { self.m_axis.basis_selection--; console.log("Selected Basis: " + self.m_axis.basis_selection ); }; } ) (this) );	
 }

function update_camera( self, animation_delta_time )
{
    var camera_rot_y;
    var vec_eye = vec3();
    var vec_at = vec3();
    var vec_up = vec3(0, 1, 0);

    var speed = 1/10;

    switch (self.chooseAnim) {
        case 0:     // Walking
            camera_rot_y = 45;
            vec_eye = vec3(0, 10, 40);
            vec_at = vec3(0, 4, 0);

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
            break;
        case 1:     // Jumping
            speed = 1 / 10;
            vec_eye = vec3(0, 10, 40);
            vec_at = vec3(0, 4, 0);

            camera_rot_y = 45 - ((self.animation_duration*speed) > 90 ? 90 : (self.animation_duration*speed));
            vec_eye[1] = 10 + ((self.animation_duration*speed/4.5) > 20 ? 20 : (self.animation_duration*speed/4.5));
            vec_eye[2] = 40 + ((self.animation_duration*speed/9) > 10 ? 10 : (self.animation_duration*speed/9));

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
            break;
        case 2:     // Walking
            speed = 1 / 10;
            vec_eye = vec3(0, 10, 40);
            vec_at = vec3(0, 4, 0);

            camera_rot_y = -45 - ((self.animation_duration * speed) > 270 ? 270 : (self.animation_duration * speed));
            vec_eye[1] = 30 - ((self.animation_duration * speed / 13.5) > 20 ? 20 : (self.animation_duration * speed / 13.5));
            vec_eye[2] = 50 - ((self.animation_duration * speed / 27) > 10 ? 10 : (self.animation_duration * speed / 27));

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
            break;
        case 3:     // Walking, sees mushrooms
            speed = 1 / 10;
            vec_eye = vec3(0, 10, 40);
            vec_at = vec3(0, 4, 0);
            camera_rot_y = 45;

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
            break;
        case 4:     // Hears sound, starts running - camera circle around
            speed = 1 / 10;
            vec_eye = vec3(0, 10, 40);
            vec_at = vec3(0, 4, 0);

            camera_rot_y = 45 - ((self.animation_duration * speed) > 360 ? 360 : (self.animation_duration * speed));
            vec_eye[2] = 40 - ((self.animation_duration * speed / 18) > 20 ? 20 : (self.animation_duration * speed / 18));

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
            break;
        case 5:     // Running off ledge - camera stay still and track
            vec_eye = vec3(-20/Math.SQRT2, 10, 20/Math.SQRT2);
            vec_at = vec3(0, 4, 0);

            vec_eye[2] = 20/Math.SQRT2 - (3 * self.animation_duration / 100);

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            break;
        case 6:     // Running in mid air
            vec_eye = vec3(-20, 10, 50);
            vec_at = vec3(0, 4, 0);
                        
            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            break;
        case 7:     // Falling off ledge
            vec_eye = vec3(-20, 10, 50);
            vec_at = vec3(0, 4, 0);

            vec_eye[1] = 10 + ((self.animation_duration / 10 > 50)? 50 : self.animation_duration/10);
            vec_at[1] = 4 + ((self.animation_duration / 10 > 50)? 50 : self.animation_duration/10);

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            break;
        case 8:     // Camera look down at kirby flying
            vec_eye = vec3(-20, 60, 50);
            vec_at = vec3(0, 54, 0);

            vec_at[1] = 54 - ((self.animation_duration / 25 > 50) ? 50 : self.animation_duration / 25);
            if (self.animation_duration / 25 < 50)
                var height = 0;
            else {
                if (self.animation_duration / 25 > 100)
                    var height = 50;
                else
                    var height = self.animation_duration/25 - 50;
            }
            vec_eye[1] = 60 - height;

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            break;
        case 9:     // Kirby fly away - camera stay still and track
            vec_eye = vec3(-20, 60, 50);
            vec_at = vec3(0, 4, 0);

            vec_eye[2] = 50 - (3 * self.animation_duration / 100);
            vec_eye[1] = 10 - (self.animation_duration / 50);

            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            break;
        default:
            self.camera_transform = lookAt(vec_eye, vec_at, vec_up);
            self.camera_transform = mult(self.camera_transform, rotate(camera_rot_y, 0, 1, 0));
    }
}

// *******************************************************	
// display(): called once per frame, whenever OpenGL decides it's time to redraw.

Animation.prototype.display = function(time)
{
	if(!time) time = 0;
	this.animation_delta_time = time - prev_time;
	if(animate) this.animation_time += this.animation_delta_time;
    //prev_time = time;     // Now happens in update_strings
	var animDone = false;
	var speed = 1;
		
	update_camera( this, this.animation_delta_time );
			
	if (this.basis_stack.length == 0) {
	    var model_transform = mat4(1);                      // Identity matrix to start with
	}
	else {
	    model_transform = this.basis_stack.pop();
	}
	if (this.ground_stack.length == 0) {
	    var ground_transform = mult(mat4(1), translate(0, 0, this.levelstart));
	    model_transform = mult(model_transform, translate(0, 5, 0));    // Go to origin of kirby
	}
	else {
	    ground_transform = this.ground_stack.pop();
	}

	this.music.play();
		
	/**********************************
	Start coding here!!!!
	**********************************/

	this.drawLevel(ground_transform);
	
	switch (this.chooseAnim) {
	    case 0: // Walking
	        [model_transform, animDone] = this.drawKirbyWalking(model_transform, 9);
	        break;
	    case 1: // Jumping
	        [model_transform, animDone] = this.drawKirbyJumping(model_transform, 1.7);
	        speed = 3;
	        break;
	    case 2: // Walking
	        [model_transform, animDone] = this.drawKirbyWalking(model_transform, 4);
	        break;
	    case 3: // Walking, see mushrooms
	        [model_transform, animDone] = this.drawKirbyWalking(model_transform, 1);
	        this.mushroomAttack += .05*this.animation_delta_time;
	        break;
	    case 4: // Sees mushrooms, starts running - camera circle around
	        [model_transform, animDone] = this.drawKirbyRunning(model_transform, 14);
	        speed = 3;
	        break;
	    case 5: // Running off ledge - camera stay still and track
	        [model_transform, animDone] = this.drawKirbyRunning(model_transform, 6);
	        speed = 3;
	        break;
	    case 6: // Running in mid air
	        [model_transform, animDone] = this.drawKirbyRunning(model_transform, 4);
	        speed = 0;
	        break;
	    case 7: // Falling off ledge
	        [model_transform, animDone] = this.drawKirbyRunning(model_transform, 4);
	        speed = 0;
	        var falling = (this.animation_duration / 10 > 50) ? 0 : 1;
	        ground_transform = mult(ground_transform, translate(0, falling * this.animation_delta_time / 10, 0));
	        break;
	    case 8: // Camera look down at kirby flying
	        [model_transform, animDone] = this.drawKirbyFlying(model_transform, 4);
	        speed = 0;
	        break;
	    case 9: // Kirby fly away - camera stay still and track
	        [model_transform, animDone] = this.drawKirbyFlying(model_transform, 19);
	        speed = 3;
	        if (this.animation_duration > 1500)
	            this.theEnd = 1;
	        break;
	    default:
	        this.chooseAnim = 0;
	        this.mushroomAttack = 0;
	        this.theEnd = 0;
	        ground_transform = mult(mat4(1), translate(0, 0, this.levelstart));
	}
	if (animDone) {     // If animation done, then add 1 to chooseAnim, reset animation_duration, and move to next switch case
	    this.chooseAnim += 1;
	    this.animation_duration = 0;
	}
	else
	    this.animation_duration += this.animation_delta_time;

	ground_transform = mult(ground_transform, translate(0, 0, speed * -this.animation_delta_time / 100 ));     // Moving ground underneath kirby

	this.ground_stack.push(ground_transform);   // Save ground position
	this.basis_stack.push(model_transform);     // Push whatever was returned last to save for next frame
}	



Animation.prototype.update_strings = function( debug_screen_object )		// Strings this particular class contributes to the UI
{
    if (Math.floor(this.animation_time / 200) > Math.floor(prev_time / 200))    // Limit refresh to every 0.2 seconds
        debug_screen_object.string_map["FPS"] = "FPS: " + Math.floor(1000 / this.animation_delta_time);
    prev_time = this.animation_time;
}

Animation.prototype.drawLevel = function (model_transform)
{
    /* Draw ground, background, and level objects (blocks and mushroom)
    Enters at world origin (identity matrix)
    Returns at world origin
    */

    var levellength = 1000;
    var blocksize = 6;

    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Ground color white (to support texture)
    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(model_transform, scale(100, 1, levellength));
    this.m_ground.draw(model_transform, this.camera_transform, this.projection_transform, "ground4.png");
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(mult(mult(model_transform, translate(50, 20, 0)), scale(0, 40, levellength)), rotate(90, 0, 0, -1));
    this.m_background1.draw(model_transform, this.camera_transform, this.projection_transform, "whispy_woods.png");     // Draw background to kirby left
    model_transform = this.basis_stack.pop();   // Restore world origin
    
    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(mult(mult(model_transform, translate(-50, 20, 0)), scale(0, 40, levellength)), rotate(90, 0, 0, -1));
    this.m_background2.draw(model_transform, this.camera_transform, this.projection_transform, "whispy_woods.png");     // Draw background to kirby right
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(mult(model_transform, translate(0, blocksize/2 + .5, 200)), scale(blocksize,blocksize,blocksize));
    this.m_block[0].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    this.basis_stack.push(model_transform);     // Save first block position and scale

    model_transform = mult(translate(20, 0, 15), model_transform);
    this.m_block[1].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    model_transform = this.basis_stack.pop();   // Restore first block position and scale

    this.basis_stack.push(model_transform);     // Save first block position and scale
    model_transform = mult(translate(25, 0, -15), model_transform);
    this.m_block[2].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    model_transform = this.basis_stack.pop();   // Restore first block position and scale

    this.basis_stack.push(model_transform);     // Save first block position and scale
    model_transform = mult(translate(-30, 0, 5), model_transform);
    this.m_block[3].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    model_transform = this.basis_stack.pop();   // Restore first block position and scale

    this.basis_stack.push(model_transform);     // Save first block position and scale
    model_transform = mult(translate(-15, 0, -20), model_transform);
    this.m_block[4].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    model_transform = this.basis_stack.pop();   // Restore first block position and scale

    this.basis_stack.push(model_transform);     // Save first block position and scale
    model_transform = mult(translate(0, 0, 25), model_transform);
    this.m_block[5].draw(model_transform, this.camera_transform, this.projection_transform, "block2.png");
    model_transform = this.basis_stack.pop();   // Restore first block position and scale
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.mushroomAttack = (this.mushroomAttack > 7) ? 7 : this.mushroomAttack       // Raise mushrooms up no more than 7, so they pop out of ground

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(model_transform, translate(25, -7 + (this.mushroomAttack) + 3*(this.mushroomAttack/7*Math.abs(Math.sin(this.animation_time/200))), 270));
    this.drawMushroom(model_transform,0);
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(model_transform, translate(-15, -7 + (this.mushroomAttack), 280));
    this.drawMushroom(model_transform,1);
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(model_transform, translate(-20, -7 + (this.mushroomAttack) + 3*(this.mushroomAttack/7*Math.abs(Math.sin(this.animation_time/200))), 325))
    this.drawMushroom(model_transform,0);
    model_transform = this.basis_stack.pop();   // Restore world origin

    this.basis_stack.push(model_transform);     // Save world origin
    model_transform = mult(model_transform, translate(20, -7 + (this.mushroomAttack), 335))
    this.drawMushroom(model_transform,1);

    if (this.theEnd) {
        model_transform = this.basis_stack.pop()

        this.basis_stack.push(model_transform);
        model_transform = mult(mult(mult(model_transform, translate(0, 70-this.animation_duration/50, 700)), scale(250,250,0)), rotate(180,0,1,0));
        this.m_theend.draw(model_transform, this.camera_transform, this.projection_transform, "the_end.png");
    }

    return this.basis_stack.pop();      // Restore world origin
}

Animation.prototype.drawKirbyFlying = function (model_transform, playCount)
{
    /* Draw kirby flying
    Enters at kirby origin
    Returns at kirby origin
    */

    // Constants
    var body_rad = 4;
    var feet_angle_x = 25;
    var feet_angle_z = 30;
    var eye_angle = 20;
    var cheek_angle_x = 23;
    var cheek_angle_y = 40;

    // Time-based variables
    var kirby_height = 2*(Math.sin(this.animation_duration/100+90)+1)/2;
    //var kirby_height = 10;
    var arm_angle = 50*(Math.sin(this.animation_duration/100)+1)/2

    // Draw body
    gl.uniform4fv(g_addrs.color_loc, this.color_body);        // Body color pink
    this.basis_stack.push(model_transform);     // Save kirby origin
    model_transform = mult(model_transform, translate(0, kirby_height, 0));
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(model_transform, scale(body_rad,body_rad,body_rad));
    this.m_body.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();	// Restore kirby flying

    // Draw left cheek
    this.basis_stack.push(model_transform);     // Save kirby flying
    model_transform = mult(mult(mult(mult(model_transform, rotate(cheek_angle_x, 1,0,0)), rotate(cheek_angle_y, 0, -1, 0)), translate(0, 0, body_rad-1)), scale(2, 2, 2));
    this.m_cheekl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby flying

    // Draw right cheek
    this.basis_stack.push(model_transform);     // Save kirby flying
    model_transform = mult(mult(mult(mult(model_transform, rotate(cheek_angle_x, 1, 0, 0)), rotate(cheek_angle_y, 0, 1, 0)), translate(0, 0, body_rad-1)), scale(2, 2, 2));
    this.m_cheekr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby flying
	
    // Draw left arm
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(model_transform, rotate(arm_angle,0,0,-1)), translate(-body_rad, 0, 0));
	this.m_arml.draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying

    // Draw right arm
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(model_transform, rotate(arm_angle,0,0,1)), translate(body_rad, 0, 0));
	this.m_armr.draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying

    // Draw left foot
	gl.uniform4fv(g_addrs.color_loc, this.color_foot);        // Foot color red
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(mult(model_transform, rotate(feet_angle_x, 1, 0, 0)), rotate(feet_angle_z, 0, 0, 1)), translate(0, -body_rad, 0)), scale(1, 2, 1));
	this.m_footl.draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying

    // Draw right foot
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(mult(model_transform, rotate(feet_angle_x, 1, 0, 0)), rotate(feet_angle_z, 0, 0, -1)), translate(0, -body_rad, 0)), scale(1, 2, 1));
	this.m_footr.draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying
    
    // Draw left eye
	gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(-.75, 0, body_rad-.1)), scale(.3, 1, .1));
	this.m_eyel[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw left eye pupil
	gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
	model_transform = mult(mult(model_transform, translate(0,.35,0)), scale(.75, .5, 1.5));
	this.m_eyel[1].draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying

    // Draw right eye
	gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(.75, 0, body_rad - .1)), scale(.3, 1, .2));
	this.m_eyer[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw right eye pupil
	gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
	model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
	this.m_eyer[1].draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying
	
    // Draw mouth
	gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Mouth color black
	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(model_transform, rotate(20,1,0,0)), translate(0, 0, body_rad-.1)), scale(1, .1, .2));
	this.m_mouth[0].draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop();   // Restore kirby flying

	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(mult(model_transform, rotate(18,0,-1,0)), rotate(20,1,0,0)), translate(0,0,body_rad-.1)), scale(.5,1,.2));
	this.m_mouth[1].draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop()    // Restore kirby flying

	this.basis_stack.push(model_transform);     // Save kirby flying
	model_transform = mult(mult(mult(mult(model_transform, rotate(18, 0, 1, 0)), rotate(20, 1, 0, 0)), translate(0, 0, body_rad-.1)), scale(.5, 1, .2));
	this.m_mouth[2].draw(model_transform, this.camera_transform, this.projection_transform);
	model_transform = this.basis_stack.pop()    // Restore kirby flying

	if (this.animation_duration > 628.3 * playCount)     // Time needed to complete the animation once multiplied by playCount
	    var animDone = true;
	else
	    var animDone = false;

	model_transform = this.basis_stack.pop();
	return [model_transform, animDone];      // Return kirby origin
}

Animation.prototype.drawKirbyRunning = function (model_transform, playCount)
{
    /* Draw kirby running
    Enters at kirby origin
    Returns at kirby origin
    */

    // Constants
    var body_rad = 3.2;
    var feet_angle_z = 30;
    var feet_offset = 30;
    var eye_angle = 20;
    var cheek_angle_x = 23;
    var cheek_angle_y = 40;
    var run_speed = 60;     // default 60
    var arm_angle = 40;
    var kirby_height = 0;

    // Time-based variables
    //var kirby_height = 8 + 2 * (Math.sin(this.animation_duration / run_speed + 90) + 1) / 2;
    //var arm_angle = 30 + 15 * (Math.sin(this.animation_duration / (run_speed/2)) + 1) / 2
    var feet_angle_x = 45 * Math.sin(this.animation_duration / run_speed);
    var footl_ankle_rot = 90 * (Math.sin(this.animation_duration / run_speed) + 1) / 2;
    var footr_ankle_rot = 90 * (Math.sin(this.animation_duration / run_speed + 90) + 1) / 2;
    var body_rot = 15 * Math.sin(this.animation_duration / run_speed);      // default 15

    // Draw body
    gl.uniform4fv(g_addrs.color_loc, this.color_body);        // Body color pink
    this.basis_stack.push(model_transform);     // Save kirby origin
    model_transform = mult(mult(model_transform, rotate(body_rot,0,1,0)), translate(0, kirby_height, 0));
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(model_transform, scale(body_rad, body_rad, body_rad));
    this.m_body.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();	// Restore kirby running

    // Draw left arm
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(model_transform, rotate(arm_angle, 0, 0, -1)), translate(-body_rad, 0, 0));
    this.m_arml.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw right arm
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(model_transform, rotate(arm_angle, 0, 0, 1)), translate(body_rad, 0, 0));
    this.m_armr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw left foot
    gl.uniform4fv(g_addrs.color_loc, this.color_foot);        // Foot color red
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(feet_angle_x,1,0,0)), rotate(feet_offset,1,0,0)), rotate(feet_angle_z, 0, 0, 1)), translate(0, -body_rad, .75)), rotate(footl_ankle_rot,1,0,0)), scale(1, 1, 2));
    this.m_footl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw right foot
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(-feet_angle_x,1,0,0)), rotate(feet_offset,1,0,0)), rotate(feet_angle_z, 0, 0, -1)), translate(0, -body_rad, .75)), rotate(footr_ankle_rot,1,0,0)), scale(1, 1, 2));
    this.m_footr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw left eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(-.75, 0, body_rad - .1)), scale(.3, 1, .1));
    this.m_eyel[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw left eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyel[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw right eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(.75, 0, body_rad - .1)), scale(.3, 1, .2));
    this.m_eyer[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw right eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyer[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw mouth
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Mouth color black
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(model_transform, rotate(20, 1, 0, 0)), translate(0, 0, body_rad - .1)), scale(1, 1, .2));
    this.m_mouth[0].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    // Draw blush
    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(model_transform, rotate(30, 0, -1, 0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby running

    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby running
    model_transform = mult(mult(mult(model_transform, rotate(30, 0, 1, 0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop()    // Restore kirby running

    if (this.animation_duration > 377 * playCount)     // Time needed to complete the animation once multiplied by playCount
        var animDone = true;
    else
        var animDone = false;

    model_transform = this.basis_stack.pop();
    return [model_transform, animDone];    // Return kirby origin
}

Animation.prototype.drawKirbyWalking = function (model_transform, playCount) {
    /* Draw kirby walking
    Enters at kirby origin
    Returns at kirby origin
    */

    // Constants
    var body_rad = 3.2;
    var feet_angle_z = 30;
    var feet_offset = 30;
    var eye_angle = 20;
    var cheek_angle_x = 23;
    var cheek_angle_y = 40;
    var walk_speed = 150;     // default 150
    //var arm_rot_z = -20;
    var kirby_height = 0;

    // Time-based variables
    //var kirby_height = 8 + 2 * (Math.sin(this.animation_duration / walk_speed + 90) + 1) / 2;
    var arml_rot_y = 20 * Math.sin(this.animation_duration / walk_speed + Math.PI);
    var armr_rot_y = 20 * Math.sin(this.animation_duration / walk_speed + Math.PI);
    var arm_rot_z = -15 + 10 * (Math.sin(this.animation_duration / (walk_speed / 2)) + 1) / 2
    var feet_angle_x = 45 * Math.sin(this.animation_duration / walk_speed);
    var footl_ankle_rot = 90 * (Math.sin(this.animation_duration / walk_speed) + 1) / 2;
    var footr_ankle_rot = 90 * (Math.sin(this.animation_duration / walk_speed + 90) + 1) / 2;
    var body_rot = 10 * Math.sin(this.animation_duration / walk_speed);      // default 15

    // Draw body
    gl.uniform4fv(g_addrs.color_loc, this.color_body);        // Body color pink
    this.basis_stack.push(model_transform);     // Save kirby origin
    model_transform = mult(mult(model_transform, rotate(body_rot, 0, 1, 0)), translate(0, kirby_height, 0));
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(model_transform, scale(body_rad, body_rad, body_rad));
    this.m_body.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();	// Restore kirby walking

    // Draw left arm
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(arml_rot_y,0,1,0)), rotate(arm_rot_z, 0, 0, -1)), translate(-body_rad, 0, 0));
    this.m_arml.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw right arm
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(armr_rot_y,0,1,0)), rotate(arm_rot_z, 0, 0, 1)), translate(body_rad, 0, 0));
    this.m_armr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw left foot
    gl.uniform4fv(g_addrs.color_loc, this.color_foot);        // Foot color red
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(feet_angle_x, 1, 0, 0)), rotate(feet_offset, 1, 0, 0)), rotate(feet_angle_z, 0, 0, 1)), translate(0, -body_rad, .75)), rotate(footl_ankle_rot, 1, 0, 0)), scale(1, 1, 2));
    this.m_footl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw right foot
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(-feet_angle_x, 1, 0, 0)), rotate(feet_offset, 1, 0, 0)), rotate(feet_angle_z, 0, 0, -1)), translate(0, -body_rad, .75)), rotate(footr_ankle_rot, 1, 0, 0)), scale(1, 1, 2));
    this.m_footr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw left eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(-.75, 0, body_rad - .1)), scale(.3, 1, .1));
    this.m_eyel[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw left eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyel[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw right eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(.75, 0, body_rad - .1)), scale(.3, 1, .2));
    this.m_eyer[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw right eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyer[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw mouth
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Mouth color black
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(20, 1, 0, 0)), translate(0, 0, body_rad - .1)), scale(.2, .2, .2));
    this.m_mouth[0].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    // Draw blush
    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(30,0,-1,0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby walking

    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby walking
    model_transform = mult(mult(mult(model_transform, rotate(30, 0, 1, 0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop()    // Restore kirby walking

    if (this.animation_duration > 942.5 * playCount)     // Time needed to complete the animation once multiplied by playCount
        var animDone = true;
    else
        var animDone = false;

    model_transform = this.basis_stack.pop();
    return [model_transform, animDone];        // Return kirby origin
}

Animation.prototype.drawKirbyJumping = function (model_transform, playCount) {
    /* Draw kirby jumping
    Enters at kirby origin
    Returns at kirby origin
    */

    // Constants
    var body_rad = 3.2;
    var feet_angle_z = 30;
    var feet_offset = 0;
    var feet_angle_x = 0;
    var footl_ankle_rot = 0;
    var footr_ankle_rot = 0;
    var body_rot = 0;
    var eye_angle = 20;
    var cheek_angle_x = 23;
    var cheek_angle_y = 40;
    var jump_speed = 140;     // default 140
    var arml_rot_y = 0;
    var armr_rot_y = 0;
    var arm_rot_z = 30;

    // Time-based variables
    var kirby_height = (8 * (Math.sin(this.animation_duration / jump_speed - (Math.PI/6)) + 1) / 2) - 1;
    if (kirby_height < 0) kirby_height = 0;

    var kirby_roll = 360 * -Math.cos(((this.animation_duration / (jump_speed * 2)) + (Math.PI/3)) % (Math.PI));
    if (kirby_roll < 0) kirby_roll = 0;

    var arm_rot_z = 30 * (Math.sin(this.animation_duration / jump_speed + (Math.PI/6)) + 1) / 2
    var feet_offset = 30 + 25 * Math.sin(this.animation_duration / jump_speed + (Math.PI/3));     // Control feet moving behind body (toward butt)
    var foot_ankle_rot = 90 * Math.sin(this.animation_duration / jump_speed + (Math.PI/3));   // Makes foot point downward more
    if (foot_ankle_rot < 0) foot_ankle_rot = 0;

    // Draw body
    gl.uniform4fv(g_addrs.color_loc, this.color_body);        // Body color pink
    this.basis_stack.push(model_transform);     // Save kirby origin
    model_transform = mult(mult(mult(model_transform, rotate(body_rot, 0, 1, 0)), translate(0, kirby_height, 0)), rotate(kirby_roll,1,0,0));
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(model_transform, scale(body_rad, body_rad, body_rad));
    this.m_body.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();	// Restore kirby jumping

    // Draw left arm
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(arml_rot_y, 0, 1, 0)), rotate(arm_rot_z, 0, 0, -1)), translate(-body_rad, 0, 0));
    this.m_arml.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw right arm
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(armr_rot_y, 0, 1, 0)), rotate(arm_rot_z, 0, 0, 1)), translate(body_rad, 0, 0));
    this.m_armr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw left foot
    gl.uniform4fv(g_addrs.color_loc, this.color_foot);        // Foot color red
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(feet_angle_x, 1, 0, 0)), rotate(feet_offset, 1, 0, 0)), rotate(feet_angle_z, 0, 0, 1)), translate(0, -body_rad, .75)), rotate(foot_ankle_rot, 1, 0, 0)), scale(1, 1, 2));
    this.m_footl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw right foot
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(mult(mult(mult(model_transform, rotate(-feet_angle_x, 1, 0, 0)), rotate(feet_offset, 1, 0, 0)), rotate(feet_angle_z, 0, 0, -1)), translate(0, -body_rad, .75)), rotate(foot_ankle_rot, 1, 0, 0)), scale(1, 1, 2));
    this.m_footr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw left eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(-.75, 0, body_rad - .1)), scale(.3, 1, .1));
    this.m_eyel[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw left eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyel[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw right eye
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Eye color black
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(eye_angle, -1, 0, 0)), translate(.75, 0, body_rad - .1)), scale(.3, 1, .2));
    this.m_eyer[0].draw(model_transform, this.camera_transform, this.projection_transform);

    // Draw right eye pupil
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));        // Eye pupil white
    model_transform = mult(mult(model_transform, translate(0, .35, 0)), scale(.75, .5, 1.5));
    this.m_eyer[1].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw mouth
    gl.uniform4fv(g_addrs.color_loc, vec4(0 / 255, 0 / 255, 0 / 255, 1));        // Mouth color black
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(20, 1, 0, 0)), translate(0, 0, body_rad - .1)), scale(.2, .2, .2));
    this.m_mouth[0].draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    // Draw blush
    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(30, 0, -1, 0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushl.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop();   // Restore kirby jumping

    gl.uniform4fv(g_addrs.color_loc, this.color_blush);        // Blush color red
    this.basis_stack.push(model_transform);     // Save kirby jumping
    model_transform = mult(mult(mult(model_transform, rotate(30, 0, 1, 0)), translate(0, 0, body_rad)), scale(.4, .2, .1));
    this.m_blushr.draw(model_transform, this.camera_transform, this.projection_transform);
    model_transform = this.basis_stack.pop()    // Restore kirby jumping

    if (this.animation_duration > 879.6 * playCount)     // Time needed to complete the animation once multiplied by playCount (885?)
        var animDone = true;
    else
        var animDone = false;

    model_transform = this.basis_stack.pop();
    return [model_transform, animDone];      // Return kirby jumping
}

Animation.prototype.drawMushroom = function(model_transform, toptype)
{
    /* Draw mushroom
    Enters at origin
    Returns at origin
    */

	// START mushroom trunk
	var stem_angle = 10*Math.sin(this.animation_time/200);
	
    gl.uniform4fv(g_addrs.color_loc, vec4(253 / 255, 204 / 255, 172 / 255, 1));			// mushroom trunk color		
	this.basis_stack.push(model_transform);                                             // Save world origin
	model_transform = mult(mult(mult(model_transform, translate(0,1,0)), scale(2,2,2)), rotate(0, 1, 0, 0));                        // Origin of mushroom trunk
	
	for (var i = 0; i < this.m_stem.length ; i++) {
	    this.m_stem[i].draw(model_transform, this.camera_transform, this.projection_transform);
	    model_transform = mult(model_transform, translate(0,.5,0));
	    this.basis_stack.push(model_transform);     // Save new top of stem
	    model_transform = mult(mult(model_transform, rotate(stem_angle, 0, 0, -1)), translate(0, .5, 0));
	}
	model_transform = this.basis_stack.pop();        // Go back one because we did not use the last transform in the for loop
    // END mushroom trunk
	
	// START mushroom top
    //gl.uniform4fv(g_addrs.color_loc, vec4(254 / 255, 0 / 255, 0 / 255, 1));		    // mushroom top color
    gl.uniform4fv(g_addrs.color_loc, vec4(255 / 255, 255 / 255, 255 / 255, 1));			// mushroom top color
	this.basis_stack.push(model_transform);                                             // Save top of stem
	if (toptype == 0) {   // Use half_sphere for top
	    model_transform = mult(mult(model_transform, translate(0, 0, 0)), scale(2, 2, 2));
	    this.m_mushtop.draw(model_transform, this.camera_transform, this.projection_transform, "mushroom.png");
	}
	else if (toptype == 1) {    // Use pyramid for top
	    model_transform = mult(mult(model_transform, translate(0, 0, 0)), scale(4, 2, 4));
	    this.m_mushtop2.draw(model_transform, this.camera_transform, this.projection_transform, "mushroom2.png");
	}
	model_transform = this.basis_stack.pop();
    // END mushroom top
    
	return this.basis_stack.splice(-this.m_stem.length, this.m_stem.length)[0];		    // Go back to world origin
}