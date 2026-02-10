<?php
/**
 * GoBee - Landing Page Router
 * 
 * Mechanism:
 * Access via site.com.br/ -> Maintenance Page
 * Access via site.com.br/?mode=dev -> Real Home Page
 */

// Start session to store developer access
session_start();

// Check if URL parameter is present to activate dev mode
if (isset($_GET['mode']) && $_GET['mode'] === 'dev') {
    $_SESSION['gobee_dev_access'] = true;
}

// Route logic
if (isset($_SESSION['gobee_dev_access']) && $_SESSION['gobee_dev_access'] === true) {
    // Show main site to developer
    include 'home.html';
} else {
    // Show maintenance page to public
    include 'maintenance.html';
}
?>
