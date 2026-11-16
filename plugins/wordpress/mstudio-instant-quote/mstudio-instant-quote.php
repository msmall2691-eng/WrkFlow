<?php
/**
 * Plugin Name:       Instant Quote by M Studio
 * Plugin URI:        https://mlinx.studio/plugins
 * Description:       A quote calculator for your site. Visitors pick a service, see a price range from your prices, and send you the lead. Add it anywhere with the [instant_quote] shortcode.
 * Version:           1.0.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            M Studio
 * Author URI:        https://mlinx.studio
 * License:           GPL-2.0-or-later
 * Text Domain:       mstudio-instant-quote
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'MSTUDIO_IQ_VERSION', '1.0.0' );
define( 'MSTUDIO_IQ_OPTION', 'mstudio_instant_quote' );

/**
 * Defaults shown on first install, so the shortcode works straight away.
 * Generic sample services; the owner replaces them with real prices.
 */
function mstudio_iq_defaults() {
	return array(
		'business' => get_bloginfo( 'name' ),
		'email'    => get_option( 'admin_email' ),
		'site'     => '',
		'endpoint' => '',
		'color'    => '#1d4ed8',
		'title'    => 'Get an instant estimate',
		'button'   => 'Send me this quote',
		'note'     => 'A guide, not a final price. Confirmed after a quick look.',
		'services' => wp_json_encode(
			array(
				array( 'name' => 'Small job', 'base' => 150, 'perUnit' => 0 ),
				array( 'name' => 'By the hour', 'base' => 0, 'perUnit' => 85, 'unit' => 'hour', 'min' => 1, 'max' => 16, 'start' => 3 ),
			),
			JSON_PRETTY_PRINT
		),
		'extras'   => wp_json_encode( array( array( 'name' => 'Same-week scheduling', 'price' => 50 ) ), JSON_PRETTY_PRINT ),
	);
}

function mstudio_iq_settings() {
	return wp_parse_args( get_option( MSTUDIO_IQ_OPTION, array() ), mstudio_iq_defaults() );
}

/* ---------- Shortcode ---------- */

add_action(
	'wp_enqueue_scripts',
	function () {
		wp_register_script(
			'mstudio-instant-quote',
			plugins_url( 'assets/quote.js', __FILE__ ),
			array(),
			MSTUDIO_IQ_VERSION,
			true
		);
	}
);

add_shortcode(
	'instant_quote',
	function ( $atts ) {
		$s    = mstudio_iq_settings();
		$atts = shortcode_atts( array( 'title' => '', 'demo' => '' ), $atts, 'instant_quote' );

		$config = array(
			'business' => $s['business'],
			'color'    => $s['color'],
			'title'    => $atts['title'] ? $atts['title'] : $s['title'],
			'button'   => $s['button'],
			'note'     => $s['note'],
			'services' => json_decode( $s['services'], true ),
			'extras'   => json_decode( $s['extras'], true ),
		);
		// Delivery: site key (M Studio relay), then your own endpoint, then email.
		if ( $s['site'] ) {
			$config['site'] = $s['site'];
		} elseif ( $s['endpoint'] ) {
			$config['endpoint'] = $s['endpoint'];
		} elseif ( $s['email'] ) {
			$config['email'] = $s['email'];
		}
		if ( 'true' === $atts['demo'] ) {
			$config['demo'] = true;
		}

		wp_enqueue_script( 'mstudio-instant-quote' );

		// JSON_HEX_TAG keeps "</script>" in a setting from closing the tag early.
		$json = wp_json_encode( $config, JSON_HEX_TAG | JSON_HEX_AMP );
		return '<div data-mstudio-quote><script type="application/json">' . $json . '</script></div>';
	}
);

/* ---------- Settings page ---------- */

add_action(
	'admin_menu',
	function () {
		add_options_page(
			'Instant Quote',
			'Instant Quote',
			'manage_options',
			'mstudio-instant-quote',
			'mstudio_iq_render_settings'
		);
	}
);

add_action(
	'admin_init',
	function () {
		register_setting(
			'mstudio_iq',
			MSTUDIO_IQ_OPTION,
			array( 'sanitize_callback' => 'mstudio_iq_sanitize' )
		);
	}
);

function mstudio_iq_sanitize( $in ) {
	$prev = mstudio_iq_settings();
	$out  = array(
		'business' => sanitize_text_field( $in['business'] ?? '' ),
		'email'    => sanitize_email( $in['email'] ?? '' ),
		'site'     => sanitize_key( $in['site'] ?? '' ),
		'endpoint' => esc_url_raw( $in['endpoint'] ?? '' ),
		'color'    => sanitize_hex_color( $in['color'] ?? '' ) ? sanitize_hex_color( $in['color'] ) : '#1d4ed8',
		'title'    => sanitize_text_field( $in['title'] ?? '' ),
		'button'   => sanitize_text_field( $in['button'] ?? '' ),
		'note'     => sanitize_text_field( $in['note'] ?? '' ),
	);
	foreach ( array( 'services', 'extras' ) as $key ) {
		$raw  = (string) ( $in[ $key ] ?? '' ); // options.php has already unslashed it.
		$data = json_decode( $raw, true );
		if ( null === $data || ! is_array( $data ) ) {
			add_settings_error( MSTUDIO_IQ_OPTION, $key, ucfirst( $key ) . ' is not valid JSON, so the previous version was kept.' );
			$out[ $key ] = $prev[ $key ];
		} else {
			$out[ $key ] = wp_json_encode( $data, JSON_PRETTY_PRINT );
		}
	}
	return $out;
}

function mstudio_iq_render_settings() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$s = mstudio_iq_settings();
	$n = MSTUDIO_IQ_OPTION;
	?>
	<div class="wrap">
		<h1>Instant Quote</h1>
		<p>Put <code>[instant_quote]</code> on any page or post. In the block editor, use a Shortcode block.</p>
		<form method="post" action="options.php">
			<?php settings_fields( 'mstudio_iq' ); ?>
			<table class="form-table" role="presentation">
				<tr><th scope="row"><label for="iq-business">Business name</label></th>
					<td><input id="iq-business" class="regular-text" name="<?php echo esc_attr( $n ); ?>[business]" value="<?php echo esc_attr( $s['business'] ); ?>"></td></tr>
				<tr><th scope="row"><label for="iq-email">Send leads to</label></th>
					<td><input id="iq-email" type="email" class="regular-text" name="<?php echo esc_attr( $n ); ?>[email]" value="<?php echo esc_attr( $s['email'] ); ?>">
					<p class="description">Without a site key or form endpoint, the visitor's email app opens with the quote filled in, addressed here.</p></td></tr>
				<tr><th scope="row"><label for="iq-site">M Studio site key</label></th>
					<td><input id="iq-site" class="regular-text" name="<?php echo esc_attr( $n ); ?>[site]" value="<?php echo esc_attr( $s['site'] ); ?>">
					<p class="description">Optional. With a key from M Studio, leads are emailed to you directly and the visitor never leaves the page.</p></td></tr>
				<tr><th scope="row"><label for="iq-endpoint">Form endpoint</label></th>
					<td><input id="iq-endpoint" type="url" class="regular-text" name="<?php echo esc_attr( $n ); ?>[endpoint]" value="<?php echo esc_attr( $s['endpoint'] ); ?>">
					<p class="description">Optional. A Formspree, Zapier or other URL that accepts a JSON POST.</p></td></tr>
				<tr><th scope="row"><label for="iq-color">Button color</label></th>
					<td><input id="iq-color" type="color" name="<?php echo esc_attr( $n ); ?>[color]" value="<?php echo esc_attr( $s['color'] ); ?>"></td></tr>
				<tr><th scope="row"><label for="iq-title">Heading</label></th>
					<td><input id="iq-title" class="regular-text" name="<?php echo esc_attr( $n ); ?>[title]" value="<?php echo esc_attr( $s['title'] ); ?>"></td></tr>
				<tr><th scope="row"><label for="iq-button">Button text</label></th>
					<td><input id="iq-button" class="regular-text" name="<?php echo esc_attr( $n ); ?>[button]" value="<?php echo esc_attr( $s['button'] ); ?>"></td></tr>
				<tr><th scope="row"><label for="iq-note">Note under the price</label></th>
					<td><input id="iq-note" class="large-text" name="<?php echo esc_attr( $n ); ?>[note]" value="<?php echo esc_attr( $s['note'] ); ?>"></td></tr>
				<tr><th scope="row"><label for="iq-services">Services and prices</label></th>
					<td><textarea id="iq-services" class="large-text code" rows="12" name="<?php echo esc_attr( $n ); ?>[services]"><?php echo esc_textarea( $s['services'] ); ?></textarea>
					<p class="description">Each service: <code>name</code>, <code>base</code> (flat price), and optionally <code>perUnit</code>, <code>unit</code>, <code>min</code>, <code>max</code>, <code>start</code>. The range shown is 90% to 115% of base plus perUnit times size.</p></td></tr>
				<tr><th scope="row"><label for="iq-extras">Add-ons</label></th>
					<td><textarea id="iq-extras" class="large-text code" rows="5" name="<?php echo esc_attr( $n ); ?>[extras]"><?php echo esc_textarea( $s['extras'] ); ?></textarea>
					<p class="description">Each add-on: <code>name</code> and <code>price</code>. Use <code>[]</code> for none.</p></td></tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

add_filter(
	'plugin_action_links_' . plugin_basename( __FILE__ ),
	function ( $links ) {
		array_unshift( $links, '<a href="' . esc_url( admin_url( 'options-general.php?page=mstudio-instant-quote' ) ) . '">Settings</a>' );
		return $links;
	}
);
