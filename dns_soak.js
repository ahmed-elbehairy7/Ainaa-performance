import dns from "k6/x/dns";
import { check } from "k6";

const smallDuration = "30m";
const duration = "6h";

export const options = {
	stages: [
		{ duration: "20s", target: 100 }, // Ramp up to 100 users
		{ duration: smallDuration, target: 1000 }, // Ramp up to 1000 users
		{ duration: smallDuration, target: 5000 }, // Ramp up to 5000 users
		{ duration: smallDuration, target: 10000 }, // Ramp up to 10000 users
		{ duration, target: 10000 }, // Stay at 10000 users
		{ duration: "1m", target: 0 }, // Ramp down to 0 users
	],
	thresholds: {
		// dns_resolution_duration: ["avg < 400", "p(95)<400", "p(99)<600"], // Average resolution time under 50ms
		// dns_resolutions: ["count > 0"], // Ensure at least one resolution occurs
		checks: ["rate>0.95"],
	},
};

const dnsServer = "157.175.116.122:53"; // Replace with your DNS server's IP:port
const domainTests = {
	"www.google.com": "216.239.38.120",
	"www.spotify.com": "0.0.0.0",
};
export default async function () {
	let ips;
	const domainKeys = Object.keys(domainTests);
	const key = domainKeys[Math.floor(Math.random() * domainKeys.length)];
	try {
		ips = await dns.resolve(key, "A", dnsServer);
	} catch (error) {
		//
	} finally {
		check(ips, {
			[`${key} resolved to ${domainTests[key]}`]: (r) =>
				r && r[0] === domainTests[key],
		});
	}
}
