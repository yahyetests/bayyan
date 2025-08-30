<?php
/**
 * Plugin Name: Video Whiteboard
 * Description: Allows two users to video call and share a whiteboard.
 * Version: 1.0.0
 * Author: OpenAI ChatGPT
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

// Enqueue required scripts
function vw_enqueue_scripts() {
    wp_enqueue_script(
        'peerjs',
        'https://unpkg.com/peerjs@1.5.2/dist/peerjs.min.js',
        array(),
        '1.5.2',
        true
    );
    wp_enqueue_script(
        'vw-script',
        plugin_dir_url( __FILE__ ) . 'assets/js/video-whiteboard.js',
        array( 'peerjs' ),
        '1.0.0',
        true
    );
}
add_action( 'wp_enqueue_scripts', 'vw_enqueue_scripts' );

// Shortcode to render video call and whiteboard interface
function vw_shortcode() {
    ob_start();
    ?>
    <div id="vw-container">
        <video id="vw-local-video" autoplay playsinline muted></video>
        <video id="vw-remote-video" autoplay playsinline></video>
        <canvas id="vw-whiteboard" width="600" height="400" style="border:1px solid #000"></canvas>
        <div>
            <input type="text" id="vw-peer-id" placeholder="Peer ID to connect">
            <button id="vw-connect">Connect</button>
            <span>Your ID: <span id="vw-my-id"></span></span>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode( 'video_whiteboard', 'vw_shortcode' );
