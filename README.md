# SmugMug SSO

NodeBB Plugin that allows users to login/register via their SmugMug account.

## Installation

    npm install nodebb-plugin-sso-smugmug

## Configuration

1. Create or Log Into your SmugMug account and apply for an API key via the ["Hacks" section](http://www.smugmug.com/hack/apikeys): http://www.smugmug.com/hack/apikeys
1. Locate your Key and Secret under the "Discovery" tab of your account settings.
1. Set your "Callback URL" as the domain you access your NodeBB with `/auth/smugmug/callback` appended to it (e.g. `https://forum.mygreatwebsite.com/auth/smugmug/callback`)