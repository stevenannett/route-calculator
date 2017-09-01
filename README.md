# route-calculator

Calculates the best route to multiple destinations based on shortest distance. Written in Node.js.


## Usage

'''
npm start
'''

## Examples

### POST localhost/route ###

Request a route with two destinations, receive a token

#### Request ####

'''
[
	["22.511200", "114.126183"],
	["22.336931", "114.176336"],
	["22.377130", "114.197439"]
]
'''

#### Response ####

'''
{
    "token": "d9f5de4415cd0284845f0085e34678010b80"
}
'''

### GET localhost/route/d9f5de4415cd0284845f0085e34678010b80 ###

Get an update on the request related to the token sent


#### Response ####

'''
{
    "status": "success",
    "path": [
        [
            "22.511200",
            "114.126183"
        ],
        [
            "22.377130",
            "114.197439"
        ],
        [
            "22.336931",
            "114.176336"
        ]
    ],
    "total_distance": 32824,
    "total_time": 2534
}
'''