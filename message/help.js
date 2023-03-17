const moment = require("moment-timezone");
const fs = require("fs");

moment.tz.setDefault("Asia/Makassar").locale("id");
let setting = JSON.parse(fs.readFileSync('./config.json'))
const tanggal = moment.tz('Asia/Makassar').format('DD/MM/20YY')
const jam = moment.tz('asia/Makassar').format('HH:mm:ss')

const more = String.fromCharCode(8206)
const readmore = more.repeat(4001)

function toCommas(x) {
	x = x.toString()
	var pattern = /(-?\d+)(\d{3})/;
     while (pattern.test(x))
	   x = x.replace(pattern, "$1,$2");
	return x;
}

exports.allmenu = (sender, prefix, pushname, ucapanWaktu2) => {
	return `*── 「 ${setting.botName} 」 ──*
	
 _*Ucapan : ${ucapanWaktu2}*_

 Library : *Baileys-MD*
 Prefix : ( ${prefix} )
 Tanggal Server : ${tanggal}
 Waktu Server : ${jam}

 *MAIN MENU*
 *≻* ${prefix}menu
 *≻* ${prefix}owner
 *≻* ${prefix}speed
 *≻* ${prefix}runtime

 *CONVERTER/TOOLS*
 *≻* ${prefix}sticker
 *≻* ${prefix}toimg
 *≻* ${prefix}tovid

 *STORE MENU*
 *≻* ${prefix}list
 *≻* ${prefix}addlist
 *≻* ${prefix}dellist
 *≻* ${prefix}update
 *≻* p
 *≻* d

 *CHECK MENU*
 *≻* ${prefix}nickff
 *≻* ${prefix}nickml
 *≻* ${prefix}nickpubg
 *≻* ${prefix}nickcodm
 *≻* ${prefix}nickgenshin
 *≻* ${prefix}servermc

 *GROUP MENU*
 *≻* ${prefix}linkgrup
 *≻* ${prefix}setppgrup
 *≻* ${prefix}setnamegc
 *≻* ${prefix}setdesc
 *≻* ${prefix}revoke
 *≻* ${prefix}hidetag
 *≻* ${prefix}add
 *≻* ${prefix}kick
 *≻* ${prefix}promote
 *≻* ${prefix}demote
 *≻* ${prefix}group
 *≻* ${prefix}afk

*OWNER MENU*
 *≻* ${prefix}broadcast
 *≻* ${prefix}exif
 *≻* ${prefix}sendsession
 *≻* ${prefix}join
 *≻* ${prefix}leave
 *≻* ${prefix}block
 *≻* ${prefix}unblock
 *≻* ${prefix}setppbot
 *≻* ${prefix}setcmd
 *≻* ${prefix}delcmd
`
}
