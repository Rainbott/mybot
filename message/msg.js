/*

• Base : Ori Irfan
• Bot By : Christian ID
• Kalau Mau Recode Minimal Kasih Thanks To Goblok Jangan Asal Comot Gw Kasih Babi Lu

*/

"use strict";
const {
	downloadContentFromMessage
} = require("@adiwajshing/baileys")
const { color, bgcolor } = require('../lib/color')
const { getBuffer, fetchJson, fetchText, getRandom, getGroupAdmins, runtime, sleep, makeid } = require("../lib/myfunc");
const { addResponList, delResponList, isAlreadyResponList, isAlreadyResponListGroup, sendResponList, updateResponList, getDataResponList } = require('../lib/respon-list');
const { isSetProses, addSetProses, removeSetProses, changeSetProses, getTextSetProses } = require('../lib/setproses');
const { isSetDone, addSetDone, removeSetDone, changeSetDone, getTextSetDone } = require('../lib/setdone');
const { addAfkUser, checkAfkUser, getAfkReason, getAfkTime, getAfkId, getAfkPosition } = require('../lib/afk');
const { addRespons, checkRespons, deleteRespons } = require('../lib/respon');
const { webp2mp4File } = require("../lib/convert")
const msgFilter = require("../lib/antispam");

const fs = require ("fs");
const moment = require("moment-timezone");
const util = require("util");
const { exec, spawn } = require("child_process");
const ffmpeg = require("fluent-ffmpeg");
const imgbb = require("imgbb-uploader");
const xfar = require('xfarr-api');
const axios = require("axios");
const hxz = require("hxz-api");
const ra = require("ra-api");
const kotz = require("kotz-api");
const yts = require("yt-search");
const speed = require("performance-now");
const request = require("request");
const ms = require("parse-ms");

// Exif
const Exif = require("../lib/exif")
const exif = new Exif()

// Database
let pendaftar = JSON.parse(fs.readFileSync('./database/user.json'))
let mess = JSON.parse(fs.readFileSync('./message/response.json'));
let db_respon_list = JSON.parse(fs.readFileSync('./database/list-message.json'));
let welcome = JSON.parse(fs.readFileSync('./database/welcome.json'));
let antilink = JSON.parse(fs.readFileSync('./database/antilink.json'));
let set_proses = JSON.parse(fs.readFileSync('./database/set_proses.json'));
let set_done = JSON.parse(fs.readFileSync('./database/set_done.json'));
let responDB = JSON.parse(fs.readFileSync('./database/respon.json'));

moment.tz.setDefault("Asia/Jakarta").locale("id");

module.exports = async(conn, msg, m, setting, store, welcome, _afk) => {
	try {
		let { ownerNumber, ownerName, botName, footer } = setting
		let { allmenu } = require('./help')
		const { type, quotedMsg, mentioned, now, fromMe } = msg
		if (msg.isBaileys) return
        let d = new Date
        let locale = 'id'
		const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
		const tanggal = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
		let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
		var fildt = dt == 'pagi' ? dt + '🌝' : dt == 'siang' ? dt + '🌞' : dt == 'sore' ? dt + '🌝' : dt + '🌚'
        const ucapanWaktu = fildt.charAt(0).toUpperCase() + fildt.slice(1)
		const content = JSON.stringify(msg.message)
		const from = msg.key.remoteJid
		const footernya = setting.footer
		const chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
                const toJSON = j => JSON.stringify(j, null,'\t')
		if (conn.multi) {
			var prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#'
		} else {
			if (conn.nopref) {
				prefix = ''
			} else {
				prefix = conn.prefa
			}
		}
		const args = chats.split(' ')
		const command = chats.toLowerCase().split(' ')[0] || ''
		const isCmd = command.startsWith(prefix)
		const isGroup = msg.key.remoteJid.endsWith('@g.us')
		const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid
		const isOwner = ownerNumber.includes(sender)
		const pushname = msg.pushName
		const isNan = args[1]
		const q = chats.slice(command.length + 1, chats.length)
		const body = chats.startsWith(prefix) ? chats : ''
		const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
		const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.id : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender)
		const isUser = pendaftar.includes(sender)
		const isAntiLink = isGroup ? antilink.includes(from) : false
        const isWelcome = isGroup ? welcome.includes(from) ? true : false : false
        const isAfkOn = checkAfkUser(sender, _afk)
		const pp_bot = fs.readFileSync(setting.pathimg)

        const fimage = {key: { fromMe: false,participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) },message: { "imageMessage": { "title":`${ownerName}`, "h": `Hmm`,'seconds': '359996400', 'caption': `*_✘ BALASAN MENFESS ✘_*`, 'jpegThumbnail': pp_bot}}}
        const fkontak = { key: {participant: `0@s.whatsapp.net`, ...(from ? { remoteJid: "status@broadcast" } : {}) }, message: { 'contactMessage': { 'displayName': `${pushname}`, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${pushname},;;;\nFN:${pushname},\nitem1.TEL;waid=${sender.split('@')[0]}:${sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp_bot, thumbnail: pp_bot,sendEphemeral: true}}}
		const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
                const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
                const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
                mention != undefined ? mention.push(mentionByReply) : []
                const mentionUser = mention != undefined ? mention.filter(n => n) : []
		
		async function downloadAndSaveMediaMessage (type_file, path_file) {
			if (type_file === 'image') {
				var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'video') {
				var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'sticker') {
				var stream = await downloadContentFromMessage(msg.message.stickerMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			} else if (type_file === 'audio') {
				var stream = await downloadContentFromMessage(msg.message.audioMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.audioMessage, 'audio')
				let buffer = Buffer.from([])
				for await(const chunk of stream) {
					buffer = Buffer.concat([buffer, chunk])
				}
				fs.writeFileSync(path_file, buffer)
				return path_file
			}
		}
		const sendFileFromUrl = async (from, url, caption, options = {}) => {
		    let mime = '';
		    let res = await axios.head(url)
		    mime = res.headerd["content-type"]
		    let type = mime.split("/")[0]+"Message"
		    if (mime.split("/")[0] === "image") {
		       var img = await getBuffer(url)
		       return conn.sendMessage(from, { image: img, caption: caption }, options)
		    } else if (mime.split("/")[0] === "video") {
		       var vid = await getBuffer(url)
		       return conn.sendMessage(from, { video: vid, caption: caption }, options)
		    } else if (mime.split("/")[0] === "audio") {
		       var aud = await getBuffer(url)
		       return conn.sendMessage(from, { audio: aud, mimetype: 'audio/mp3' }, options)
		    } else {
		       var doc = await getBuffer(url)
		       return conn.sendMessage(from, { document: doc, mimetype: mime, caption: caption }, options)
		    }
		}
		const isUrl = (url) => {
			return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
		}
		function jsonformat(string) {
            return JSON.stringify(string, null, 2)
        }
		function monospace(string) {
            return '```' + string + '```'
        }
		function randomNomor(min, max = null) {
		  if (max !== null) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min + 1)) + min;
		  } else {
			return Math.floor(Math.random() * min) + 1
		  }
		}
		const pickRandom = (arr) => {
			return arr[Math.floor(Math.random() * arr.length)]
		}
		function mentions(teks, mems = [], id) {
			if (id == null || id == undefined || id == false) {
			  let res = conn.sendMessage(from, { text: teks, mentions: mems })
			  return res
			} else {
		      let res = conn.sendMessage(from, { text: teks, mentions: mems }, { quoted: msg })
		      return res
 		    }
		}
		const reply = (teks) => {
			conn.sendMessage(from, { text: teks }, { quoted: msg })
		}
		const textImg = (teks) => {
			return conn.sendMessage(from, { text: teks, jpegThumbnail: pp_bot }, { quoted: msg })
		}
		const sendMess = (hehe, teks) => {
			conn.sendMessage(hehe, { text, teks })
		}
		const buttonWithText = (from, text, footer, buttons) => {
			return conn.sendMessage(from, { text: text, footer: footer, templateButtons: buttons })
		}
		const sendContact = (jid, numbers, name, quoted, mn) => {
			let number = numbers.replace(/[^0-9]/g, '')
			const vcard = 'BEGIN:VCARD\n' 
			+ 'VERSION:3.0\n' 
			+ 'FN:' + name + '\n'
			+ 'ORG:;\n'
			+ 'TEL;type=CELL;type=VOICE;waid=' + number + ':+' + number + '\n'
			+ 'END:VCARD'
			return conn.sendMessage(from, { contacts: { displayName: name, contacts: [{ vcard }] }, mentions : mn ? mn : []},{ quoted: quoted })
		}
		
		const buttonsDefault = [
		    { urlButton: { displayText: `My Web`, url : `${setting.link}` } },
		]
        
		const isImage = (type == 'imageMessage')
		const isVideo = (type == 'videoMessage')
		const isSticker = (type == 'stickerMessage')
		const isQuotedMsg = (type == 'extendedTextMessage')
		const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
		const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false
		const isQuotedDocument = isQuotedMsg ? content.includes('documentMessage') ? true : false : false
		const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
		const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false

		// Auto Read & Presence Online
		conn.readMessages([msg.key])
		conn.sendPresenceUpdate('available', from)
		
		// Auto Registrasi
		if (isCmd && !isUser) {
		  pendaftar.push(sender)
		  fs.writeFileSync('./database/user.json', JSON.stringify(pendaftar, null, 2))
		}
		
		// Store
        if (!isCmd && isGroup && isAlreadyResponList(from, chats, db_respon_list)) {
            var get_data_respon = getDataResponList(from, chats, db_respon_list)
            if (get_data_respon.isImage === false) {
                conn.sendMessage(from, { text: sendResponList(from, chats, db_respon_list) }, {
                    quoted: msg
                })
            } else {
                conn.sendMessage(from, { image: await getBuffer(get_data_respon.image_url), caption: get_data_respon.response }, {
                    quoted: msg
                })
            }
        }
		
		// Antispam
        msgFilter.ResetSpam(conn.spam)

		const spampm = () => {
            console.log(color('[ SPAM ]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`))
            msgFilter.addSpam(sender, conn.spam)
            reply(`Kamu terdeteksi spam bot tanpa jeda, lakukan perintah setelah 5 detik`)
        }
        const spamgr = () => {
            console.log(color('[ SPAM ]', 'red'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
            msgFilter.addSpam(sender, conn.spam)
            reply(`Kamu terdeteksi spam bot tanpa jeda, lakukan perintah setelah 5 detik`)
        }
        
        if (isCmd && msgFilter.isFiltered(sender) && !isGroup) return spampm()
        if (isCmd && msgFilter.isFiltered(sender) && isGroup) return spamgr()
        if (isCmd && args[0].length > 1 && !isOwner) msgFilter.addFilter(sender)
        
        //Resize
         const reSize = async(buffer, ukur1, ukur2) => {
             return new Promise(async(resolve, reject) => {
             let jimp = require('jimp')
             var baper = await jimp.read(buffer);
             var ab = await baper.resize(ukur1, ukur2).getBufferAsync(jimp.MIME_JPEG)
             resolve(ab)
             })
             }
             
             // Anti link
        if (isGroup && isAntiLink && !isOwner && !isGroupAdmins && isBotGroupAdmins){
            if (chats.includes(`https://chat.whatsapp.com`)) {
                reply(`*「 GROUP LINK DETECTOR 」*\n\nSepertinya kamu mengirimkan link grup, maaf kamu akan di kick`)
                await conn.sendMessage(from, { delete: msg.key })
                let number = sender
      conn.groupParticipantsUpdate(from, [number], "remove")
            }
        }
             
  //TIME
const time2 = moment().tz('Asia/Jakarta').format('HH:mm:ss')  
 if(time2 < "23:59:00"){
var ucapanWaktu2 = 'Selamat Malam 🌌'
 }
 if(time2 < "19:00:00"){
var ucapanWaktu2 = 'Selamat Sore 🌃'
 }
 if(time2 < "18:00:00"){
var ucapanWaktu2 = 'Selamat Sore 🌅'
 }
 if(time2 < "15:00:00"){
var ucapanWaktu2 = 'Selamat Siang 🏙'
 }
 if(time2 < "11:00:00"){
var ucapanWaktu2 = 'Selamat Pagi 🌄'
 }
 if(time2 < "05:00:00"){
var ucapanWaktu2 = 'Selamat Pagi 🌉'
 } 
 
		if (chats.startsWith("> ") && isOwner) {
		console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
		  const ev = (sul) => {
            var sat = JSON.stringify(sul, null, 2)
            var bang = util.format(sat)
            if (sat == undefined) {
              bang = util.format(sul)
            }
            return textImg(bang)
          }
          try {
           textImg(util.format(eval(`;(async () => { ${chats.slice(2)} })()`)))
          } catch (e) {
           textImg(util.format(e))
          }
		} else if (chats.startsWith("$ ") && isOwner) {
        console.log(color('[EXEC]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkoakwoak`))
          exec(chats.slice(2), (err, stdout) => {
		    if (err) return reply(`${err}`)
		    if (stdout) reply(`${stdout}`)
		  })
        } else if (chats.startsWith("x ") && isOwner) {
	    console.log(color('[EVAL]'), color(moment(msg.messageTimestamp * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`Dari Owner aowkaokwoak`))
		 try {
	       let evaled = await eval(chats.slice(2))
		   if (typeof evaled !== 'string') evaled = require("util").inspect(evaled)
			reply(`${evaled}`)
		 } catch (err) {
		   reply(`${err}`)
		 }
		}
		
		// Logs;
		if (!isGroup && isCmd && !fromMe) {
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp * 1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname))
		}
		if (isGroup && isCmd && !fromMe) {
			console.log('->[\x1b[1;32mCMD\x1b[1;37m]', color(moment(msg.messageTimestamp *1000).format('DD/MM/YYYY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(groupName))
		}
		
		function triggerSticker() {
            try {
                for (let x = 0; x < responDB.length; x++) {
                    if (msg.message.stickerMessage.fileSha256.toString('hex') == responDB[x].hex) {
                        return responDB[x].balasan;
                    }
                }
            } catch {
                return false;
            }
        }
        switch (command || triggerSticker()) {
			// Main Menu
			case prefix+'helpmenu':
			case prefix+'help':
			case prefix+'fitur':
			    function _0x271c(){var _0x5aa4c0=['17148XIDNlh','109184peWunQ','13229829AyZxxG','search','40803vmmGgU','1568883wJnxoX','media/zeys.jpg','sendMessage','(((.+)+)+)+$','828gTNTqu','15263280LLiagC','40051510eTIUyQ','77jqTaRm','305qJerfV','toString'];_0x271c=function(){return _0x5aa4c0;};return _0x271c();}var _0x510bb4=_0x1d7f;(function(_0x5c0d2a,_0x13f359){var _0x53702a=_0x1d7f,_0x2752ae=_0x5c0d2a();while(!![]){try{var _0x5c2c98=-parseInt(_0x53702a(0xe0))/0x1*(parseInt(_0x53702a(0xe3))/0x2)+parseInt(_0x53702a(0xd9))/0x3+parseInt(_0x53702a(0xe4))/0x4*(-parseInt(_0x53702a(0xe1))/0x5)+-parseInt(_0x53702a(0xdd))/0x6*(parseInt(_0x53702a(0xd8))/0x7)+-parseInt(_0x53702a(0xde))/0x8+parseInt(_0x53702a(0xe5))/0x9+parseInt(_0x53702a(0xdf))/0xa;if(_0x5c2c98===_0x13f359)break;else _0x2752ae['push'](_0x2752ae['shift']());}catch(_0x29b4f3){_0x2752ae['push'](_0x2752ae['shift']());}}}(_0x271c,0xea80f));var _0x1515c3=(function(){var _0x3a3157=!![];return function(_0x3b9b28,_0x3071c7){var _0x5d4751=_0x3a3157?function(){if(_0x3071c7){var _0x42b9e8=_0x3071c7['apply'](_0x3b9b28,arguments);return _0x3071c7=null,_0x42b9e8;}}:function(){};return _0x3a3157=![],_0x5d4751;};}()),_0x48b1aa=_0x1515c3(this,function(){var _0x3d5f98=_0x1d7f;return _0x48b1aa['toString']()[_0x3d5f98(0xe6)](_0x3d5f98(0xdc))[_0x3d5f98(0xe2)]()['constructor'](_0x48b1aa)['search'](_0x3d5f98(0xdc));});_0x48b1aa();var teks=allmenu(sender,prefix,pushname,ucapanWaktu2),pp=await conn['reSize'](fs['readFileSync'](_0x510bb4(0xda)),0x12c,0x96);function _0x1d7f(_0x145884,_0xf1cc8a){var _0x87a0f6=_0x271c();return _0x1d7f=function(_0x48b1aa,_0x1515c3){_0x48b1aa=_0x48b1aa-0xd8;var _0x271c39=_0x87a0f6[_0x48b1aa];return _0x271c39;},_0x1d7f(_0x145884,_0xf1cc8a);}conn[_0x510bb4(0xdb)](from,{'viewOnce':!![],'caption':teks,'location':{'jpegThumbnail':pp},'templateButtons':buttonsDefault,'footer':footernya,'mentions':[sender]});
                break
			case prefix+'runtime':
			    reply(runtime(process.uptime()))
			    break
			case prefix+'speed':
			    let timestamp = speed();
                            let latensi = speed() - timestamp
                            textImg(`${latensi.toFixed(4)} Second`)
		            break
			case prefix+'owner':
			    for (let x of ownerNumber) {
			      sendContact(from, x.split('@s.whatsapp.net')[0], `${ownerName}`, msg)
			    }
			    break
	        // Converter & Tools Menu
			case prefix+'sticker': case prefix+'stiker': case prefix+'s':
				if (isImage || isQuotedImage) {
		           var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
			       var buffer = Buffer.from([])
			       for await(const chunk of stream) {
			          buffer = Buffer.concat([buffer, chunk])
			       }
			       var rand1 = 'sticker/'+getRandom('.jpg')
			       var rand2 = 'sticker/'+getRandom('.webp')
			       fs.writeFileSync(`./${rand1}`, buffer)
			       ffmpeg(`./${rand1}`)
				.on("error", console.error)
				.on("end", () => {
				  exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				    conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
					fs.unlinkSync(`./${rand1}`)
			            fs.unlinkSync(`./${rand2}`)
			          })
				 })
				.addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				.toFormat('webp')
				.save(`${rand2}`)
			    } else if (isVideo || isQuotedVideo) {
				 var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
				 var buffer = Buffer.from([])
				 for await(const chunk of stream) {
				   buffer = Buffer.concat([buffer, chunk])
				 }
			     var rand1 = 'sticker/'+getRandom('.mp4')
				 var rand2 = 'sticker/'+getRandom('.webp')
			         fs.writeFileSync(`./${rand1}`, buffer)
			         ffmpeg(`./${rand1}`)
				  .on("error", console.error)
				  .on("end", () => {
				    exec(`webpmux -set exif ./sticker/data.exif ./${rand2} -o ./${rand2}`, async (error) => {
				      conn.sendMessage(from, { sticker: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
					  fs.unlinkSync(`./${rand1}`)
				      fs.unlinkSync(`./${rand2}`)
				    })
				  })
				 .addOutputOptions(["-vcodec", "libwebp", "-vf", "scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])
				 .toFormat('webp')
				 .save(`${rand2}`)
                } else {
			       reply(`Kirim gambar/vidio dengan caption ${command} atau balas gambar/vidio yang sudah dikirim\nNote : Maximal vidio 10 detik!`)
			    }
                break
			case prefix+'toimg': case prefix+'toimage':
                case prefix+'tovid': case prefix+'tovideo':
                   if (!isQuotedSticker) return reply(`Reply stikernya!`)
                   var stream = await downloadContentFromMessage(msg.message.extendedTextMessage?.contextInfo.quotedMessage.stickerMessage, 'sticker')
                   var buffer = Buffer.from([])
                   for await(const chunk of stream) {
                     buffer = Buffer.concat([buffer, chunk])
                   }
                   var rand1 = 'sticker/'+getRandom('.webp')
                   var rand2 = 'sticker/'+getRandom('.png')
                   fs.writeFileSync(`./${rand1}`, buffer)
                   if (isQuotedSticker && msg.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage.isAnimated !== true) {
                     reply("Tunggu Sebentar...")
                     exec(`ffmpeg -i ./${rand1} ./${rand2}`, (err) => {
                       fs.unlinkSync(`./${rand1}`)
                       if (err) return reply("Maaf Terjadi Kesalahan")
                       conn.sendMessage(from, {caption: `*Nih Kak ${pushname}*`, image: fs.readFileSync(`./${rand2}`) }, { quoted: msg })
                       fs.unlinkSync(`./${rand2}`)
                     })
                   } else {
                     reply("Tunggu Sebentar...")
                     webp2mp4File(`./${rand1}`).then(async(data) => {
                       fs.unlinkSync(`./${rand1}`)
                       conn.sendMessage(from, {caption: `*Nih Kak ${pushname}*`, video: await getBuffer(data.data) }, { quoted: msg })
                     })
                   }
                   break
			// Owner Menu
			case prefix+'exif':
			    if (!isOwner) return reply(mess.OnlyOwner)
			    var namaPack = q.split('|')[0] ? q.split('|')[0] : q
                var authorPack = q.split('|')[1] ? q.split('|')[1] : ''
                exif.create(namaPack, authorPack)
				reply(`Sukses membuat exif`)
				break
case prefix+'mysesi':
case prefix+'sendsesi':
case prefix+'session':
case prefix+'sendsession':
if (!isOwner) return reply(mess.OnlyOwner)
var setting = JSON.parse(fs.readFileSync('./config.json'));
var anumu = await fs.readFileSync(`./${setting.sessionName}.json`)
conn.sendMessage(from, { document: anumu, mimetype: 'document/application', fileName: 'session.json'}, {quoted: msg } )
reply(`*Note :*\n_Session Bot Bersifat Untuk Pribadi Dari Owner Maupun Bot, Tidak Untuk User Bot Ataupun Pengguna Bot._`)
reply(`_Sedang Mengirim Document_\n_Nama Session : ${setting.sessionName}.json_\n_Mohon Tunggu Sebentar..._`)
			break
case prefix+'bc': case prefix+'broadcast':
			    if (!isOwner) return reply(mess.OnlyOwner)
			if (!q && !isImage && !isQuotedImage) return reply(`Kirim Gambar Dengan Caption ${command} text\nExample : ${command} Hallo`)
if ( isImage || isQuotedImage ) {
var media = await downloadAndSaveMediaMessage("image", `brotkes.jpeg`)
var data = await store.chats.all()
for (let i of data) {
conn.sendMessage(i.id, { caption: `「 *${botName.toUpperCase()} BROADCAST* 」\n\nTeks : ${q}`, image: fs.readFileSync(`brotkes.jpeg`), mentions: [sender]})
await sleep(1000)
}
reply(`Sukses mengirim pesan siaran kepada ${data.length} chat`)
} else {
		            if (args.length < 2) return reply(`Kirim Perintah ${command} teks\nContoh : ${command} ${setting.ownerName}`)
                            var data = await store.chats.all()
                            for (let i of data) {
                               conn.sendMessage(i.id, { text: `「 *${botName.toUpperCase()} BROADCAST* 」\n\n${q}`, mentions: [sender]})
                               await sleep(1000)
                                  }
                               reply(`Sukses mengirim pesan siaran kepada ${data.length} chat`)
                                  }
                           break
	case prefix+'join':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (args.length < 2) return reply(`Kirim perintah ${command} _linkgrup_`)
				if (!isUrl(args[1])) return reply(mess.error.Iv)
				var url = args[1]
			    url = url.split('https://chat.whatsapp.com/')[1]
				var data = await conn.groupAcceptInvite(url)
				reply(jsonformat(data))
				break
       case prefix+'block':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah *${command} nomer`)
                const block = args.join(" ")
                await conn.updateBlockStatus(args[1] + '@s.whatsapp.net', "block")
                reply(`Sukses Block Target`)
                break
            case prefix+'unblock':
                if (!isOwner) return reply(mess.OnlyOwner)
                if (args.length < 2) return reply(`Kirim perintah *${command} nomer`)
                const unblock = args.join(" ")
                await conn.updateBlockStatus(args[1] + '@s.whatsapp.net', "unblock")
                reply(`Sukses Unblock Target`)
                break
            case prefix+'leave':
			    if (!isOwner) return reply(mess.OnlyOwner)
				if (!isGroup) return reply(mess.OnlyGrup)
				conn.groupLeave(from)
			    break
case prefix+'setpp': case prefix+'setppbot':
            if (!isOwner && !fromMe) return reply(mess.OnlyOwner)
            if (isImage || isQuotedImage) {
                addCountCmd('#setppbot', sender, _cmd)
                var media = await downloadAndSaveMediaMessage('image', 'ppbot.jpeg')
                if (args[1] == '\'panjang\'') {
                    var { img } = await generateProfilePicture(media)
                    await conn.query({
                        tag: 'iq',
                        attrs: {
                            to: botNumber,
                            type:'set',
                            xmlns: 'w:profile:picture'
                        },
                        content: [
                        {
                            tag: 'picture',
                            attrs: { type: 'image' },
                            content: img
                        }
					    ]
                    })
					fs.unlinkSync(media)
					reply(`Sukses`)
				} else {
					var data = await conn.updateProfilePicture(botNumber, { url: media })
			        fs.unlinkSync(media)
				    reply(`Sukses`)
				}
            } else {
                reply(`Kirim/balas gambar dengan caption ${command} untuk mengubah foto profil bot`)
            }
            break
case prefix+'setcmd':
            if (!isOwner && !fromMe) return reply(mess.OnlyPrem)
            if (!isQuotedSticker) return reply('Reply stickernya..')
            if (!q) return reply(`Masukan balasannya...\nContoh: ${prefix}setcmd #menu`)
            if (checkRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB) === true) return reply('Key hex tersebut sudah terdaftar di database!')
            addRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), q, sender, responDB)
            reply(`*Key:* ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}\n*Action:* ${q}\n\nBerhasil di set`)
            break
        case prefix+'delcmd':
            if (!isOwner && !fromMe) return reply(mess.OnlyPrem)
            if (!isQuotedSticker) return reply('Reply stickernya..')
            if (!deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)) return reply('Key hex tersebut tidak ada di database')
            deleteRespons(msg.quotedMsg.stickerMessage.fileSha256.toString('hex'), responDB)
            reply(`Berhasil remove key hex ${msg.quotedMsg.stickerMessage.fileSha256.toString('hex')}`)
            break
// Store Menu
case prefix+'list': case prefix+'menu':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Belum ada list message yang terdaftar di group ini`)
            var arr_rows = [];
            for (let x of db_respon_list) {
                if (x.id === from) {
                    arr_rows.push({
                        title: x.key,
                        rowId: x.key
                    })
                }
            }
            var listMsg = {
                text: `${ucapanWaktu} @${sender.split("@")[0]}`,
                buttonText: 'Click Here!',
                footer: `*List ${groupName}*\n\n⏳ ${jam}\n📆 ${tanggal}`,
                mentions: [sender],
                sections: [{
                    title: groupName, rows: arr_rows
                }]
            }
            conn.sendMessage(from, listMsg)
            break
case prefix+'addlist':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]                
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (isAlreadyResponList(from, args1, db_respon_list)) return reply(`List respon dengan key : *${args1}* sudah ada di group ini.`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage("image", `${pushname}.jpeg`)
                 var njay = await imgbb(setting.imgbb, media)
                        addResponList(from, args1, args2, true, `${njay.display_url}`, db_respon_list)
                        reply(`Sukses menambahkan list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                addResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses menambahkan list message dengan key : *${args1}*`)
            }
            break
        case prefix+'dellist':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (db_respon_list.length === 0) return reply(`Belum ada list message di database`)
            if (!q) return reply(`Gunakan dengan cara ${command} *key*\n\n_Contoh_\n\n${command} hello`)
            if (!isAlreadyResponList(from, q, db_respon_list)) return reply(`List respon dengan key *${q}* tidak ada di database!`)
            delResponList(from, q, db_respon_list)
            reply(`Sukses delete list message dengan key *${q}*`)
            break
        case prefix+'updatelist': case prefix+'update':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            var args1 = q.split("@")[0]
            var args2 = q.split("@")[1]
            if (!q.includes("@")) return reply(`Gunakan dengan cara ${command} *key@response*\n\n_Contoh_\n\n${command} tes@apa`)
            if (!isAlreadyResponListGroup(from, db_respon_list)) return reply(`Maaf, untuk key *${args1}* belum terdaftar di group ini`)
            if (isImage || isQuotedImage) {
                let media = await downloadAndSaveMediaMessage("image", `${pushname}.jpeg`)
                 var njay = await imgbb(setting.imgbb, media)
                        updateResponList(from, args1, args2, true, `${njay.display_url}`, db_respon_list)
                        reply(`Sukses update list message dengan key : *${args1}*`)
                        if (fs.existsSync(media)) fs.unlinkSync(media)
            } else {
                updateResponList(from, args1, args2, false, '-', db_respon_list)
                reply(`Sukses update respon list dengan key *${args1}*`)
            }
            break
case 'P': case 'p':
if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (!isQuotedMsg) return reply(`Silakan Reply Pesanannya`)
            let proses = `「 *TRANSAKSI PENDING* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jam} WIB\n✨ STATUS : Pending\`\`\`\n\n📝 Catatan :\n${quotedMsg.chats}\n\nPesanan @${quotedMsg.sender.split("@")[0]} sedang di proses!`
            const getTextP = getTextSetProses(from, set_proses)
            if (getTextP !== undefined) {
                mentions(getTextP.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
            } else {
                mentions(proses, [quotedMsg.sender], true)
            }
break
case 'd': case 'D':
if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return reply(messAdmin)
            if (!isQuotedMsg) return reply(`Silakan Reply Pesanannya`)
            let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : ${tanggal}\n⌚ JAM : ${jam} WIB\n✨ STATUS : Berhasil\`\`\`\n\nTerimakasih @${quotedMsg.sender.split("@")[0]} Next Order Ya 🙏🏻`
            const getTextD = getTextSetDone(from, set_done);
            if (getTextD !== undefined) {
                mentions(getTextD.replace('pesan', quotedMsg.chats).replace('nama', quotedMsg.sender.split("@")[0]).replace('jam', jam).replace('tanggal', tanggal), [quotedMsg.sender], true);
            } else {
                mentions(sukses, [quotedMsg.sender], true)
            }
            break
// Group Menu
			case prefix+'linkgrup': case prefix+'link': case prefix+'linkgc':
			    if (!isGroup) return reply(mess.OnlyGrup)
				if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				var url = await conn.groupInviteCode(from).catch(() => reply(messErr))
			    url = 'https://chat.whatsapp.com/'+url
				reply(url)
				break
			case prefix+'setppgrup': case prefix+'setppgc':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (isImage || isQuotedImage) {
            var media = await downloadAndSaveMediaMessage('image', `ppgc${from}.jpeg`)
            if (args[1] == '\'panjang\'') {
            	var { img } = await generateProfilePicture(media)
            	await conn.query({
                    tag: 'iq',
                    attrs: {
                        to: from,
                        type:'set',
                        xmlns: 'w:profile:picture'
                    },
                    content: [
                    {
                        tag: 'picture',
                        attrs: { type: 'image' },
                        content: img
                    } 
                    ]
                })
                fs.unlinkSync(media)
            	reply(`Sukses`)
            } else {
                await conn.updateProfilePicture(from, { url: media })
                .then( res => {
                    reply(`Sukses`)
                    fs.unlinkSync(media)
                }).catch(() => reply(messErr))
            }
            } else {
			    reply(`Kirim/balas gambar dengan caption ${command}`)
            }
            break
			case prefix+'setnamegrup': case prefix+'setnamegc':
			    if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateSubject(from, q)
			    .then( res => {
				  reply(`Sukses`)
				}).catch(() => reply(messErr))
			    break
			case prefix+'setdesc': case prefix+'setdescription':
			    if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				if (args.length < 2) return reply(`Kirim perintah ${command} teks`)
				await conn.groupUpdateDescription(from, q)
			    .then( res => {
			      reply(`Sukses`)
				}).catch(() => reply(messErr))
				break
			case prefix+'revoke':
			    if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
				await conn.groupRevokeInvite(from)
			    .then( res => {
				  reply(`Sukses menyetel tautan undangan grup ini`)
				}).catch(() => reply(messErr))
				break
			case prefix+'hidetag':
		        if (!isGroup) return reply(mess.OnlyGrup)
				if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
			    let mem = [];
		        groupMembers.map( i => mem.push(i.id) )
				conn.sendMessage(from, { text: q ? q : '', mentions: mem })
			    break
case prefix+'add':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (groupMembers.length == 1024) return reply(`Anda tidak dapat menambah peserta, karena Grup sudah penuh!`)
            var mems = []
            groupMembers.map( i => mems.push(i.id) )
            var number;
            if (args.length > 1) {
                number = q.replace(/[^0-9]/gi, '')+"@s.whatsapp.net"
                var cek = await conn.onWhatsApp(number)
                if (cek.length == 0) return reply(`Masukkan nomer yang valid dan terdaftar di WhatsApp`)
                if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
                conn.groupParticipantsUpdate(from, [number], "add")
                .then( res => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
            } else if (isQuotedMsg) {
                number = quotedMsg.sender
                var cek = await conn.onWhatsApp(number)
                if (cek.length == 0) return reply(`Peserta tersebut sudah tidak terdaftar di WhatsApp`)
                if (mems.includes(number)) return reply(`Nomer tersebut sudah berada didalam grup!`)
                conn.groupParticipantsUpdate(from, [number], "add")
                .then( res => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
            } else {
                reply(`Kirim perintah ${command} nomer atau balas pesan orang yang ingin dimasukkan`)
            }
            break
        case prefix+'kick':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            var number;
			if (mentionUser.length !== 0) {
                number = mentionUser[0]
                conn.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
            } else if (isQuotedMsg) {
                number = quotedMsg.sender
                conn.groupParticipantsUpdate(from, [number], "remove")
                .then( res => reply(jsonformat(res)))
                .catch((err) => reply(jsonformat(err)))
            } else {
                reply(`Tag atau balas pesan orang yang ingin dikeluarkan dari grup`)
            }
            break
        case prefix+'promote': case prefix+'pm':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (mentionUser.length !== 0) {
                conn.groupParticipantsUpdate(from, [mentionUser[0]], "promote")
                .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai admin`, [mentionUser[0]], true) })
                .catch(() => reply(messErr))
            } else if (isQuotedMsg) {
                conn.groupParticipantsUpdate(from, [quotedMsg.sender], "promote")
                .then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai admin`, [quotedMsg.sender], true) })
                .catch(() => reply(messErr))
            } else {
                reply(`Tag atau balas pesan member yang ingin dijadikan admin`)
            }
            break
        case prefix+'demote':
            if (!isGroup) return reply(mess.OnlyGrup)
		    if (!isGroupAdmins) return reply(mess.GrupAdmin)
		    if (!isBotGroupAdmins) return reply(mess.BotAdmin)
            if (mentionUser.length !== 0) {
                conn.groupParticipantsUpdate(from, [mentionUser[0]], "demote")
                .then( res => { mentions(`Sukses menjadikan @${mentionUser[0].split("@")[0]} sebagai member biasa`, [mentionUser[0]], true) })
                .catch(() => reply(messErr))
            } else if (isQuotedMsg) {
                conn.groupParticipantsUpdate(from, [quotedMsg.sender], "demote")
                .then( res => { mentions(`Sukses menjadikan @${quotedMsg.sender.split("@")[0]} sebagai member biasa`, [quotedMsg.sender], true) })
                .catch(() => reply(messErr))
            } else {
                reply(`Tag atau balas pesan admin yang ingin dijadikan member biasa`)
            }
            break
         case prefix+'group': case prefix+'grup':
                   if (!isGroup) return reply(mess.OnlyGrup)
                   if (!isGroupAdmins) return reply(mess.GrupAdmin)
                   if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                   if (args.length < 2) return reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
                   if (args[1] == "close") {
                     conn.groupSettingUpdate(from, 'announcement')
                     reply(`Sukses mengizinkan hanya admin yang dapat mengirim pesan ke grup ini`)
                   } else if (args[1] == "open") {
                     conn.groupSettingUpdate(from, 'not_announcement')
                     reply(`Sukses mengizinkan semua peserta dapat mengirim pesan ke grup ini`)
                   } else {
                     reply(`Kirim perintah ${command} _options_\nOptions : close & open\nContoh : ${command} close`)
                   }
                   break
           case prefix+'welcome':
            if (!isGroup) return reply(mess.OnlyGrup)
            if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
            if (args.length === 1) return reply(`Pilih enable atau disable`)
            if (args[1].toLowerCase() === "enable") {
                if (isWelcome) return reply(`Udah aktif`)
                welcome.push(from)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                reply('Sukses mengaktifkan welcome di grup ini')
            } else if (args[1].toLowerCase() === "disable") {
                var posi = welcome.indexOf(from)
                welcome.splice(posi, 1)
                fs.writeFileSync('./database/welcome.json', JSON.stringify(welcome, null, 2))
                reply('Sukses menonaktifkan welcome di grup ini')
            } else {
                reply(`Pilih enable atau disable`)
            }
            break
          case prefix+'antilink':
                   if (!isGroup) return reply(mess.OnlyGrup)
                   if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                   if (!isBotGroupAdmins) return reply(mess.BotAdmin)
                   if (args.length === 1) return reply(`Pilih enable atau disable`)
                   if (args[1].toLowerCase() === 'enable') {
                     if (isAntiLink) return reply(`Udah aktif`)
                     antilink.push(from)
                     fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                     reply('Antilink grup aktif')
                   } else if (args[1].toLowerCase() === 'disable') {
                     if (!isAntiLink) return reply(`Udah nonaktif`)
                     let anu = antilink.indexOf(from)
                     antilink.splice(anu, 1)
                     fs.writeFileSync('./database/antilink.json', JSON.stringify(antilink, null, 2))
                     reply('Antilink grup nonaktif')
                   } else {
                     reply(`Pilih enable atau disable`)
                   }
                   break
case prefix+'afk':
                   if (!isGroup) return reply(mess.OnlyGrup)
                   if (isAfkOn) return reply('afk sudah diaktifkan sebelumnya')
                   if (body.slice(100)) return reply('Alasanlu kepanjangan')
                   let reason = body.slice(5) ? body.slice(5) : 'Nothing.'
                   addAfkUser(sender, Date.now(), reason, _afk)
                   mentions(`@${sender.split('@')[0]} sedang afk\nAlasan : ${reason}`, [sender], true)
                   break
//Cek Menu
case prefix+'nickff':
if (args.length < 2) return reply(`Kirim perintah ${command} userid\nContoh : ${command} 12345678`)
reply(mess.wait)
var ff = await fetchJson(`https://api.lolhuman.xyz/api/freefire/${args[1]}?apikey=${setting.lolhuman}`)
reply(`*Nickname Berhasil Ditemukan!*\n\nNama : ${ff.result}\nId Game : ${args[1]}`)
break
case prefix+'nickml':
if (args.length < 2) return reply(`Penggunaan ${command} idgame|idserver\n\nContoh : ${command} 84830127|2169`)
if (!q.includes("|")) return reply(`Penggunaan ${command} text1|text2\n\nContoh : ${command} 84830127|2169`)
reply(mess.wait)
var ml = await fetchJson(`https://api.lolhuman.xyz/api/mobilelegend/${q.split("|")[0]}/${q.split("|")[1]}?apikey=${setting.lolhuman}`)
reply(`*Nickname Berhasil Ditemukan!*\n\nNama : ${ml.result}\nId Game : ${q.split("|")[0]}\nId Server : ${q.split("|")[1]}`)
break
case prefix+'nickpubg':
if (args.length < 2) return reply(`Kirim perintah ${command} userid\nContoh : ${command} 5119961143`)
reply(mess.wait)
var pubg = await fetchJson(`https://api.lolhuman.xyz/api/pubg/${args[1]}?apikey=${setting.lolhuman}`)
reply(`*Nickname Berhasil Ditemukan!*\n\nNama : ${pubg.result}\nId Game : ${args[1]}`)
break
case prefix+'nickcodm':
if (args.length < 2) return reply(`Kirim perintah ${command} userid\nContoh : ${command} 6290150021186841472`)
reply(mess.wait)
var codm = await fetchJson(`https://api.lolhuman.xyz/api/codm/${args[1]}?apikey=${setting.lolhuman}`)
reply(`*Nickname Berhasil Ditemukan!*\n\nNama : ${codm.result}\nId Game : ${args[1]}`)
break
case prefix+'nickgenshin':
if (args.length < 2) return reply(`Kirim perintah ${command} userid\nContoh : ${command} 811235076`)
reply(mess.wait)
var genshin = await fetchJson(`https://api.lolhuman.xyz/api/genshin/username/811235076?apikey=${setting.lolhuman}`)
reply(`*Nickname Berhasil Ditemukan!*\n\nNama : ${genshin.result}\nId Game : ${args[1]}`)
break
case prefix+'servermc':
if (args.length < 2) return reply(`Kirim perintah ${command} userid\nContoh : ${command} org.mc-complex.com`)
reply(mess.wait)
var mc = await fetchJson(`https://api.lolhuman.xyz/api/minecraft/${args[1]}?apikey=${setting.lolhuman}`)
reply(`*Server Berhasil Ditemukan!*\n\nVersi : ${mc.result.version}\nPlayer Online : ${mc.result.players.online}\nPlayer Max : ${mc.result.players.max}\nLatency : ${mc.result.latency}\nServer : ${args[1]}`)
break
			default:
			if (!isGroup && isCmd) {
				reply(`Command belum tersedia, coba beberapa hari kedepan yaa! _^`)
			}
		}
	} catch (err) {
		console.log(color('[ERROR]', 'red'), err)
	}
}
