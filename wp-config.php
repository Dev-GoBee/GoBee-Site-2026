<?php
define( 'WP_CACHE', true );

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * Localized language
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'u622135635_Ub5ew' );

/** Database username */
define( 'DB_USER', 'u622135635_XSvCk' );

/** Database password */
define( 'DB_PASSWORD', 'rtjRSVhrb9' );

/** Database hostname */
define( 'DB_HOST', '127.0.0.1' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',          'ev@m.@?eSPjPmcts+vOZN/|lFDk~irV^`nYKTF&YM]Ps]I{fD=GUc=nG,>Y>kHl;' );
define( 'SECURE_AUTH_KEY',   'G$4tw]xS$Dh0WATqxX;@!fBAE:!u_^C0Q`&DAo,Jb!K<2Ihrjqigz3M*vXn z)8d' );
define( 'LOGGED_IN_KEY',     'z>*B 8PP&&A^vE@(:/M<7,G[1=oilfiAB4&+{Bh}v3}YaA3Mp4$H@}LBub8}{+Yx' );
define( 'NONCE_KEY',         '83_ 4F#QL^95^JvpV6+6f@$3=4u+|X1:lMiRpgO1ix0}q<dN+%8!,;-wZ@y(<!2A' );
define( 'AUTH_SALT',         '6w`ce9Y31IBeFM93#)Vtuol+*2HQUkT^xW=Wz!M3 Z/o=Q=,=jK42@%[v43}oAmd' );
define( 'SECURE_AUTH_SALT',  'L/C/W[)bZfCkGs^ PpAz{oEOME* ovl31ZQweTap4ld!^4=,`Z@YLzixff8d<r1X' );
define( 'LOGGED_IN_SALT',    'e?w7wtUBMJ1k%j^Zd-qCSao3(~b@a=_uPlL|{O(lSPfbHd*X o[aua%~]3@p=8YD' );
define( 'NONCE_SALT',        '2gX#GS)SL3T]PyjTm1d:RGajr)Yd4?*V3J/]SSP,bsv.e4Qa/}*Mk9p^}&ft2.bv' );
define( 'WP_CACHE_KEY_SALT', '=&19-Cq:%r>^`38-K @B7ed~@nfEy5%5eU;Fh/+U,Z8sK{e83)w~@Ts#={K^-k,7' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );


/* Add any custom values between this line and the "stop editing" line. */



define( 'FS_METHOD', 'direct' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
