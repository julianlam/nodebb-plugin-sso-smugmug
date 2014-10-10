<div class="row">
	<div class="col-lg-9">
		<div class="panel panel-default">
			<div class="panel-heading"><i class="fa fa-camera-retro"></i> SmugMug SSO</div>
			<div class="panel-body">
				<ol>
					<li>Create or Log Into your SmugMug account and apply for an API key via the <a href="http://www.smugmug.com/hack/apikeys">"Hacks" section</a>: <a href="http://www.smugmug.com/hack/apikeys">http://www.smugmug.com/hack/apikeys</a></li>
					<li>Locate your Key and Secret under the "Discovery" tab of your account settings.</li>
					<li>Set your "Callback URL" as the domain you access your NodeBB with <code>/auth/smugmug/callback</code> appended to it (e.g. <code>{url}/auth/smugmug/callback</code>)</li>
				</ol>
				<form class="sso-smugmug">
					<div class="form-group">
						<label for="key">Key</label>
						<input type="text" name="key" title="Key" class="form-control" placeholder="Key"><br />
					</div>
					<div class="form-group">
						<label for="secret">Secret</label>
						<input type="text" name="secret" title="Secret" class="form-control" placeholder="Client Secret">
					</div>
				</form>
			</div>
		</div>
	</div>
	<div class="col-lg-3">
		<div class="panel panel-default">
			<div class="panel-heading">SmugMug Control Panel</div>
			<div class="panel-body">
				<button class="btn btn-primary" id="save">Save Settings</button>
			</div>
		</div>
	</div>
</div>

<script>
	require(['settings'], function(Settings) {
		Settings.load('sso-smugmug', $('.sso-smugmug'));

		$('#save').on('click', function() {
			Settings.save('sso-smugmug', $('.sso-smugmug'));
		});
	});
</script>