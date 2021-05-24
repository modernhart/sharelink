const cheerio = require('cheerio');
const request = require('request');

const getFilterLink = ($, res) => {
	const shareData = {};
	const metaTitle = $('meta[property="og:title"], meta[name="og:title"], meta[itemprop="title"]').attr('content');
	const metaUrl = $('meta[property="og:url"], meta[name="og:url"], meta[itemprop="url"]').attr('content');
	const metaImage = $('meta[property="og:image"], meta[name="og:image"], meta[itemprop="image"]').attr('content');
	const pageImage = ($('img')[0]) ? $('img')[0].attribs.src : null;
	const description = $('meta[property="og:description"], meta[name="description"], meta[name="og:description"]').attr('content');
	const linkUri = res.request.uri;
	const currentUrl = linkUri.href;

	shareData.title = (metaTitle) ? metaTitle : $('title').text().trim();
	//shareData.url = (metaUrl === currentUrl) ? metaUrl : currentUrl;
	shareData.description = (description) ? description : null;
	//shareData.time = new Date().toLocaleDateString();
	shareData.image = getImage(metaImage, pageImage, linkUri, currentUrl);

	return shareData;
};

const getImage = (metaImage, pageImage, linkUri, currentUrl) => {
	var imageLink = '';
	if (metaImage) {
		imageLink = getImagePathByMeta(metaImage, linkUri);
	} else if (pageImage) {
		imageLink = getImagePathByPage(pageImage, linkUri, currentUrl);
	} else {
		imageLink = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/338px-Flag_of_None.svg.png';
	}
	return imageLink;
}

const getImagePathByMeta = (metaImage, linkUri) => {
	var result = '';
	if (!metaImage.includes('http') && !metaImage.includes('//') && metaImage.startsWith('/')) {
		result = linkUri.protocol + '//' + linkUri.hostname + metaImage;
	} else {
		result = metaImage;
	}
	return result;
}

const getImagePathByPage = (pageImage, linkUri, currentUrl) => {
	var result = '';
	var endIndex = currentUrl.lastIndexOf('/');
	if (pageImage.startsWith('.')) {
		result = currentUrl.substr(0, endIndex) + pageImage.substr(1);
	} else if (!pageImage.includes('http') && !pageImage.startsWith('/')) {
		//processing encoding image
		if (pageImage.includes(';base64')) {
			result = pageImage;
		} else {
			result = currentUrl.substr(0, endIndex) + '/' + pageImage;
		}
	} else {
		result = pageImage.includes('//') ? pageImage : linkUri.protocol + '//' + linkUri.hostname + pageImage;
	}
	return result;
};

const generateData = (link) => {
	return new Promise((resolve, reject) => {
		request(link, (error, response, body) => {
			if(error) {
				console.log("Error: " + error);
				reject(error);
			}
			const $ = cheerio.load(body);
			const data = getFilterLink($, response);
			resolve(data);
		});
	})
	
};

module.exports = {
	generateData
}
