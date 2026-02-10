<?php

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
define( 'DB_NAME', 'u622135635_1yyi8' );

/** Database username */
define( 'DB_USER', 'u622135635_AN6RS' );

/** Database password */
define( 'DB_PASSWORD', 'tvZHNKaA2n' );

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
define( 'AUTH_KEY',          '7{(5~,73?y&8PAEz>+vP[YWu19t%$R7jHW}<4E#`RsX~&*r(Fl4WQxMPo5tuKV];' );
define( 'SECURE_AUTH_KEY',   'Y_s[Ho-j&{FnXLY(#rhs|m@x8S]Ipv:g]f|JsThTZ!$W-@7P14vA.KTK5`a9B=4!' );
define( 'LOGGED_IN_KEY',     'nW-pST7EgXl~^p:[E@.iZ_iZ;#6Of2|g5[,~]>YY&VpF}PE>bw$wh@d<aE%{OAw0' );
define( 'NONCE_KEY',         '`A,eqD`NtQz1rYNTKnE>(S04b(T|-a_S(hGf:&MK2]8em+WNKT[^j1UoJip5-r[6' );
define( 'AUTH_SALT',         '2^1LKgKFfHT}`n@s%xiDOp &w?:A0`]gI2IYrevt_UmLZ]+i53Zbi*QfJ!%o5w!}' );
define( 'SECURE_AUTH_SALT',  'w2Ghdj$V>K7]OiBM;ZtTS7 6hZVURnbdi|l0iN!be;^vMl!V)7*[XC3EI_&R8aAS' );
define( 'LOGGED_IN_SALT',    '?#0J}53-n)ax]4,~q@!qK!qTNV;tDc^!Gx3*_u%7BAW{|mth8mv##l4:7;1h|T0y' );
define( 'NONCE_SALT',        '-,muN,t;;-A(;Q28>D<A<]5Vqv&H< 2rH_zuR*.lZbeK7]S-I%PHlE[@KEf>cY<{' );
define( 'WP_CACHE_KEY_SALT', 'eD !G6pEcEgxV<u.1-uddw:QeytU z~,_`o&]K7qk47+rs[z/U6.H&h~s:=#)1M ' );


/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';


/* Add any custom values between this line and the "stop editing" line. */



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
if ( ! defined( 'WP_DEBUG' ) ) {
	define( 'WP_DEBUG', false );
}

define( 'FS_METHOD', 'direct' );
define( 'COOKIEHASH', '3a993165891b233d098221707ed20d00' );
define( 'WP_AUTO_UPDATE_CORE', 'minor' );
/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
