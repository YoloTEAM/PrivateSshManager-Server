var express = require('express'),
    router = express.Router(),
    path = require('path'),
    formidable = require('formidable'),
    fs = require('fs'),
    modelsSocks = require('../app/models/socks');

var util = require('util'),
    es = require('event-stream');

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views', 'upload.html'));
});

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '../uploads');
    form.encoding = 'utf-8';
    var counter = 0,
        success = 0,
        duplicate = 0;
    var items, Socks;

    form.parse(req, function(err, fields, files) {
        Socks = getModelSocksByCountry(fields.country);

        var readStream = fs.createReadStream(files.fileToUpload.path)
            .pipe(es.split())
            .pipe(es.mapSync(function(line) {
                items = line.split("|");
                counter++;
                console.log('line : ', counter);

                //pause the readstream
                readStream.pause();
                Socks.findByIp(items[0], function(err, listSocks) {
                    if (err) {
                        readStream.resume();
                        throw err;
                    }

                    if (listSocks.length == 0) {
                        var newSock = Socks({
                            ip: items[0],
                            user: items[1],
                            pass: items[2],
                            country: items[3] || '',
                            live: items[4] || '',
                            fresh: items[5] || '',
                            bl: items[6] || '',
                            used: false
                        });

                        newSock.save(function(err) {
                            success++;
                            readStream.resume();
                        });
                    } else {
                        console.log('Socks exists!');
                        duplicate++;
                        readStream.resume();
                    }
                });
            }))

            .on('error', function() {
                console.log('Error while reading file: ' + files.fileToUpload.path);
            })

            .on('end', function() {
                console.log('Upload done (duplicate/success/total): ' + duplicate + '/' + success + '/' + counter);
                //load the fs module
                var fs = require('fs');

                fs.unlink(files.fileToUpload.path, function() {
                    console.log("File deleted: " + files.fileToUpload.path);
                });

                res.json({
                    'status': 'Upload socks success!',
                    'duplicate': duplicate,
                    'success': success,
                    'total': counter
                });
            });
    });
});

function getModelSocksByCountry(country) {
    var Socks;
    switch (country.toUpperCase()) {
        case 'AF':
            Socks = modelsSocks.AF;
            break;
        case 'AL':
            Socks = modelsSocks.AL;
            break;
        case 'DZ':
            Socks = modelsSocks.DZ;
            break;
        case 'AS':
            Socks = modelsSocks.AS;
            break;
        case 'AD':
            Socks = modelsSocks.AD;
            break;
        case 'AO':
            Socks = modelsSocks.AO;
            break;
        case 'AI':
            Socks = modelsSocks.AI;
            break;
        case 'AQ':
            Socks = modelsSocks.AQ;
            break;
        case 'AG':
            Socks = modelsSocks.AG;
            break;
        case 'AR':
            Socks = modelsSocks.AR;
            break;
        case 'AM':
            Socks = modelsSocks.AM;
            break;
        case 'AW':
            Socks = modelsSocks.AW;
            break;
        case 'AU':
            Socks = modelsSocks.AU;
            break;
        case 'AT':
            Socks = modelsSocks.AT;
            break;
        case 'AZ':
            Socks = modelsSocks.AZ;
            break;
        case 'BS':
            Socks = modelsSocks.BS;
            break;
        case 'BH':
            Socks = modelsSocks.BH;
            break;
        case 'BD':
            Socks = modelsSocks.BD;
            break;
        case 'BB':
            Socks = modelsSocks.BB;
            break;
        case 'BY':
            Socks = modelsSocks.BY;
            break;
        case 'BE':
            Socks = modelsSocks.BE;
            break;
        case 'BZ':
            Socks = modelsSocks.BZ;
            break;
        case 'BJ':
            Socks = modelsSocks.BJ;
            break;
        case 'BM':
            Socks = modelsSocks.BM;
            break;
        case 'BT':
            Socks = modelsSocks.BT;
            break;
        case 'BO':
            Socks = modelsSocks.BO;
            break;
        case 'BA':
            Socks = modelsSocks.BA;
            break;
        case 'BW':
            Socks = modelsSocks.BW;
            break;
        case 'BR':
            Socks = modelsSocks.BR;
            break;
        case 'IO':
            Socks = modelsSocks.IO;
            break;
        case 'VG':
            Socks = modelsSocks.VG;
            break;
        case 'BN':
            Socks = modelsSocks.BN;
            break;
        case 'BG':
            Socks = modelsSocks.BG;
            break;
        case 'BF':
            Socks = modelsSocks.BF;
            break;
        case 'BI':
            Socks = modelsSocks.BI;
            break;
        case 'KH':
            Socks = modelsSocks.KH;
            break;
        case 'CM':
            Socks = modelsSocks.CM;
            break;
        case 'CA':
            Socks = modelsSocks.CA;
            break;
        case 'CV':
            Socks = modelsSocks.CV;
            break;
        case 'KY':
            Socks = modelsSocks.KY;
            break;
        case 'CF':
            Socks = modelsSocks.CF;
            break;
        case 'TD':
            Socks = modelsSocks.TD;
            break;
        case 'CL':
            Socks = modelsSocks.CL;
            break;
        case 'CN':
            Socks = modelsSocks.CN;
            break;
        case 'CX':
            Socks = modelsSocks.CX;
            break;
        case 'CC':
            Socks = modelsSocks.CC;
            break;
        case 'CO':
            Socks = modelsSocks.CO;
            break;
        case 'KM':
            Socks = modelsSocks.KM;
            break;
        case 'CK':
            Socks = modelsSocks.CK;
            break;
        case 'CR':
            Socks = modelsSocks.CR;
            break;
        case 'HR':
            Socks = modelsSocks.HR;
            break;
        case 'CU':
            Socks = modelsSocks.CU;
            break;
        case 'CW':
            Socks = modelsSocks.CW;
            break;
        case 'CY':
            Socks = modelsSocks.CY;
            break;
        case 'CZ':
            Socks = modelsSocks.CZ;
            break;
        case 'CD':
            Socks = modelsSocks.CD;
            break;
        case 'DK':
            Socks = modelsSocks.DK;
            break;
        case 'DJ':
            Socks = modelsSocks.DJ;
            break;
        case 'DM':
            Socks = modelsSocks.DM;
            break;
        case 'DO':
            Socks = modelsSocks.DO;
            break;
        case 'TL':
            Socks = modelsSocks.TL;
            break;
        case 'EC':
            Socks = modelsSocks.EC;
            break;
        case 'EG':
            Socks = modelsSocks.EG;
            break;
        case 'SV':
            Socks = modelsSocks.SV;
            break;
        case 'GQ':
            Socks = modelsSocks.GQ;
            break;
        case 'ER':
            Socks = modelsSocks.ER;
            break;
        case 'EE':
            Socks = modelsSocks.EE;
            break;
        case 'ET':
            Socks = modelsSocks.ET;
            break;
        case 'FK':
            Socks = modelsSocks.FK;
            break;
        case 'FO':
            Socks = modelsSocks.FO;
            break;
        case 'FJ':
            Socks = modelsSocks.FJ;
            break;
        case 'FI':
            Socks = modelsSocks.FI;
            break;
        case 'FR':
            Socks = modelsSocks.FR;
            break;
        case 'PF':
            Socks = modelsSocks.PF;
            break;
        case 'GA':
            Socks = modelsSocks.GA;
            break;
        case 'GM':
            Socks = modelsSocks.GM;
            break;
        case 'GE':
            Socks = modelsSocks.GE;
            break;
        case 'DE':
            Socks = modelsSocks.DE;
            break;
        case 'GH':
            Socks = modelsSocks.GH;
            break;
        case 'GI':
            Socks = modelsSocks.GI;
            break;
        case 'GR':
            Socks = modelsSocks.GR;
            break;
        case 'GL':
            Socks = modelsSocks.GL;
            break;
        case 'GD':
            Socks = modelsSocks.GD;
            break;
        case 'GU':
            Socks = modelsSocks.GU;
            break;
        case 'GT':
            Socks = modelsSocks.GT;
            break;
        case 'GG':
            Socks = modelsSocks.GG;
            break;
        case 'GN':
            Socks = modelsSocks.GN;
            break;
        case 'GW':
            Socks = modelsSocks.GW;
            break;
        case 'GY':
            Socks = modelsSocks.GY;
            break;
        case 'HT':
            Socks = modelsSocks.HT;
            break;
        case 'HN':
            Socks = modelsSocks.HN;
            break;
        case 'HK':
            Socks = modelsSocks.HK;
            break;
        case 'HU':
            Socks = modelsSocks.HU;
            break;
        case 'IS':
            Socks = modelsSocks.IS;
            break;
        case 'IN':
            Socks = modelsSocks.IN;
            break;
        case 'ID':
            Socks = modelsSocks.ID;
            break;
        case 'IR':
            Socks = modelsSocks.IR;
            break;
        case 'IQ':
            Socks = modelsSocks.IQ;
            break;
        case 'IE':
            Socks = modelsSocks.IE;
            break;
        case 'IM':
            Socks = modelsSocks.IM;
            break;
        case 'IL':
            Socks = modelsSocks.IL;
            break;
        case 'IT':
            Socks = modelsSocks.IT;
            break;
        case 'CI':
            Socks = modelsSocks.CI;
            break;
        case 'JM':
            Socks = modelsSocks.JM;
            break;
        case 'JP':
            Socks = modelsSocks.JP;
            break;
        case 'JE':
            Socks = modelsSocks.JE;
            break;
        case 'JO':
            Socks = modelsSocks.JO;
            break;
        case 'KZ':
            Socks = modelsSocks.KZ;
            break;
        case 'KE':
            Socks = modelsSocks.KE;
            break;
        case 'KI':
            Socks = modelsSocks.KI;
            break;
        case 'XK':
            Socks = modelsSocks.XK;
            break;
        case 'KW':
            Socks = modelsSocks.KW;
            break;
        case 'KG':
            Socks = modelsSocks.KG;
            break;
        case 'LA':
            Socks = modelsSocks.LA;
            break;
        case 'LV':
            Socks = modelsSocks.LV;
            break;
        case 'LB':
            Socks = modelsSocks.LB;
            break;
        case 'LS':
            Socks = modelsSocks.LS;
            break;
        case 'LR':
            Socks = modelsSocks.LR;
            break;
        case 'LY':
            Socks = modelsSocks.LY;
            break;
        case 'LI':
            Socks = modelsSocks.LI;
            break;
        case 'LT':
            Socks = modelsSocks.LT;
            break;
        case 'LU':
            Socks = modelsSocks.LU;
            break;
        case 'MO':
            Socks = modelsSocks.MO;
            break;
        case 'MK':
            Socks = modelsSocks.MK;
            break;
        case 'MG':
            Socks = modelsSocks.MG;
            break;
        case 'MW':
            Socks = modelsSocks.MW;
            break;
        case 'MY':
            Socks = modelsSocks.MY;
            break;
        case 'MV':
            Socks = modelsSocks.MV;
            break;
        case 'ML':
            Socks = modelsSocks.ML;
            break;
        case 'MT':
            Socks = modelsSocks.MT;
            break;
        case 'MH':
            Socks = modelsSocks.MH;
            break;
        case 'MR':
            Socks = modelsSocks.MR;
            break;
        case 'MU':
            Socks = modelsSocks.MU;
            break;
        case 'YT':
            Socks = modelsSocks.YT;
            break;
        case 'MX':
            Socks = modelsSocks.MX;
            break;
        case 'FM':
            Socks = modelsSocks.FM;
            break;
        case 'MD':
            Socks = modelsSocks.MD;
            break;
        case 'MC':
            Socks = modelsSocks.MC;
            break;
        case 'MN':
            Socks = modelsSocks.MN;
            break;
        case 'ME':
            Socks = modelsSocks.ME;
            break;
        case 'MS':
            Socks = modelsSocks.MS;
            break;
        case 'MA':
            Socks = modelsSocks.MA;
            break;
        case 'MZ':
            Socks = modelsSocks.MZ;
            break;
        case 'MM':
            Socks = modelsSocks.MM;
            break;
        case 'NA':
            Socks = modelsSocks.NA;
            break;
        case 'NR':
            Socks = modelsSocks.NR;
            break;
        case 'NP':
            Socks = modelsSocks.NP;
            break;
        case 'NL':
            Socks = modelsSocks.NL;
            break;
        case 'AN':
            Socks = modelsSocks.AN;
            break;
        case 'NC':
            Socks = modelsSocks.NC;
            break;
        case 'NZ':
            Socks = modelsSocks.NZ;
            break;
        case 'NI':
            Socks = modelsSocks.NI;
            break;
        case 'NE':
            Socks = modelsSocks.NE;
            break;
        case 'NG':
            Socks = modelsSocks.NG;
            break;
        case 'NU':
            Socks = modelsSocks.NU;
            break;
        case 'KP':
            Socks = modelsSocks.KP;
            break;
        case 'MP':
            Socks = modelsSocks.MP;
            break;
        case 'NO':
            Socks = modelsSocks.NO;
            break;
        case 'OM':
            Socks = modelsSocks.OM;
            break;
        case 'PK':
            Socks = modelsSocks.PK;
            break;
        case 'PW':
            Socks = modelsSocks.PW;
            break;
        case 'PS':
            Socks = modelsSocks.PS;
            break;
        case 'PA':
            Socks = modelsSocks.PA;
            break;
        case 'PG':
            Socks = modelsSocks.PG;
            break;
        case 'PY':
            Socks = modelsSocks.PY;
            break;
        case 'PE':
            Socks = modelsSocks.PE;
            break;
        case 'PH':
            Socks = modelsSocks.PH;
            break;
        case 'PN':
            Socks = modelsSocks.PN;
            break;
        case 'PL':
            Socks = modelsSocks.PL;
            break;
        case 'PT':
            Socks = modelsSocks.PT;
            break;
        case 'PR':
            Socks = modelsSocks.PR;
            break;
        case 'QA':
            Socks = modelsSocks.QA;
            break;
        case 'CG':
            Socks = modelsSocks.CG;
            break;
        case 'RE':
            Socks = modelsSocks.RE;
            break;
        case 'RO':
            Socks = modelsSocks.RO;
            break;
        case 'RU':
            Socks = modelsSocks.RU;
            break;
        case 'RW':
            Socks = modelsSocks.RW;
            break;
        case 'BL':
            Socks = modelsSocks.BL;
            break;
        case 'SH':
            Socks = modelsSocks.SH;
            break;
        case 'KN':
            Socks = modelsSocks.KN;
            break;
        case 'LC':
            Socks = modelsSocks.LC;
            break;
        case 'MF':
            Socks = modelsSocks.MF;
            break;
        case 'PM':
            Socks = modelsSocks.PM;
            break;
        case 'VC':
            Socks = modelsSocks.VC;
            break;
        case 'WS':
            Socks = modelsSocks.WS;
            break;
        case 'SM':
            Socks = modelsSocks.SM;
            break;
        case 'ST':
            Socks = modelsSocks.ST;
            break;
        case 'SA':
            Socks = modelsSocks.SA;
            break;
        case 'SN':
            Socks = modelsSocks.SN;
            break;
        case 'RS':
            Socks = modelsSocks.RS;
            break;
        case 'SC':
            Socks = modelsSocks.SC;
            break;
        case 'SL':
            Socks = modelsSocks.SL;
            break;
        case 'SG':
            Socks = modelsSocks.SG;
            break;
        case 'SX':
            Socks = modelsSocks.SX;
            break;
        case 'SK':
            Socks = modelsSocks.SK;
            break;
        case 'SI':
            Socks = modelsSocks.SI;
            break;
        case 'SB':
            Socks = modelsSocks.SB;
            break;
        case 'SO':
            Socks = modelsSocks.SO;
            break;
        case 'ZA':
            Socks = modelsSocks.ZA;
            break;
        case 'KR':
            Socks = modelsSocks.KR;
            break;
        case 'SS':
            Socks = modelsSocks.SS;
            break;
        case 'ES':
            Socks = modelsSocks.ES;
            break;
        case 'LK':
            Socks = modelsSocks.LK;
            break;
        case 'SD':
            Socks = modelsSocks.SD;
            break;
        case 'SR':
            Socks = modelsSocks.SR;
            break;
        case 'SJ':
            Socks = modelsSocks.SJ;
            break;
        case 'SZ':
            Socks = modelsSocks.SZ;
            break;
        case 'SE':
            Socks = modelsSocks.SE;
            break;
        case 'CH':
            Socks = modelsSocks.CH;
            break;
        case 'SY':
            Socks = modelsSocks.SY;
            break;
        case 'TW':
            Socks = modelsSocks.TW;
            break;
        case 'TJ':
            Socks = modelsSocks.TJ;
            break;
        case 'TZ':
            Socks = modelsSocks.TZ;
            break;
        case 'TH':
            Socks = modelsSocks.TH;
            break;
        case 'TG':
            Socks = modelsSocks.TG;
            break;
        case 'TK':
            Socks = modelsSocks.TK;
            break;
        case 'TO':
            Socks = modelsSocks.TO;
            break;
        case 'TT':
            Socks = modelsSocks.TT;
            break;
        case 'TN':
            Socks = modelsSocks.TN;
            break;
        case 'TR':
            Socks = modelsSocks.TR;
            break;
        case 'TM':
            Socks = modelsSocks.TM;
            break;
        case 'TC':
            Socks = modelsSocks.TC;
            break;
        case 'TV':
            Socks = modelsSocks.TV;
            break;
        case 'VI':
            Socks = modelsSocks.VI;
            break;
        case 'UG':
            Socks = modelsSocks.UG;
            break;
        case 'UA':
            Socks = modelsSocks.UA;
            break;
        case 'AE':
            Socks = modelsSocks.AE;
            break;
        case 'GB':
            Socks = modelsSocks.GB;
            break;
        case 'US':
            Socks = modelsSocks.US;
            break;
        case 'UY':
            Socks = modelsSocks.UY;
            break;
        case 'UZ':
            Socks = modelsSocks.UZ;
            break;
        case 'VU':
            Socks = modelsSocks.VU;
            break;
        case 'VA':
            Socks = modelsSocks.VA;
            break;
        case 'VE':
            Socks = modelsSocks.VE;
            break;
        case 'VN':
            Socks = modelsSocks.VN;
            break;
        case 'WF':
            Socks = modelsSocks.WF;
            break;
        case 'EH':
            Socks = modelsSocks.EH;
            break;
        case 'YE':
            Socks = modelsSocks.YE;
            break;
        case 'ZM':
            Socks = modelsSocks.ZM;
            break;
        case 'ZW':
            Socks = modelsSocks.ZW;
            break;
    }
    return Socks;
}

module.exports = router;
