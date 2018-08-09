/*jslint browser: true*/
/*globals canvasDatagrid: false*/
/* this file is for developing in a sandbox on a local machine */
function g() {
    'use strict';
    var difficult = 'leam lee leg leechees lecythi leakproof leaguer leaked lecturn';
    var veryDifficult = '1leam 2lee 3leg 4leechees 5lecythi 6leakproof 7leaguer 8leakproof-leaguer 9leaked 10lecturn 1leam 2lee 3leg 4leechees 5lecythi 6leakproof 7leaguer 8leakproof-leaguer 9leaked 10lecturn';
    function randomWords(num) {
        var out = [];
        num = num || 20;
        var words = ["leafletting","leaflike","leafs","leafstalk","leafstalks","leafworm","leafworms","leafy","league","leagued","leaguer","leaguered","leaguering","leaguers","leagues","leaguing","leak","leakage","leakages","leaked","leaker","leakers","leakier","leakiest","leakily","leakiness","leakinesses","leaking","leakless","leakproof","leaks","leaky","leal","lealer","lealest","leally","lealties","lealty","leam","leamed","leaming","leams","lean","leaned","leaner","leaners","leanest","leaning","leanings","leanly","leanness","leannesses","leans","leant","leany","leap","leaped","leaper","leaperous","leapers","leapfrog","leapfrogged","leapfrogging","leapfrogs","leaping","leaporous","leaprous","leaps","leapt","lear","leare","leared","leares","learier","leariest","leariness","learinesses","learing","learn","learnabilities","learnability","learnable","learned","learnedly","learnedness","learnednesses","learner","learners","learning","learnings","learns","learnt","lears","leary","leas","leasable","lease","leaseback","leasebacks","leased","leasehold","leaseholder","leaseholders","leaseholds","leaser","leasers","leases","leash","leashed","leashes","leashing","leasing","leasings","leasow","leasowe","leasowed","leasowes","leasowing","leasows","least","leastaways","leasts","leastways","leastwise","leasure","leasures","leat","leather","leatherback","leatherbacks","leathered","leatherette","leatherettes","leathergoods","leatherhead","leatherheads","leatherier","leatheriest","leatheriness","leatherinesses","leathering","leatherings","leatherjacket","leatherjackets","leatherleaf","leatherleaves","leatherlike","leathern","leatherneck","leathernecks","leathers","leatherwood","leatherwoods","leathery","leats","leave","leaved","leaven","leavened","leavening","leavenings","leavenous","leavens","leaver","leavers","leaves","leavier","leaviest","leaving","leavings","leavy","leaze","leazes","lebbek","lebbeks","leben","lebens","lebensraum","lebensraums","lebkuchen","lecanora","lecanoras","leccies","leccy","lech","lechaim","lechaims","lechayim","lechayims","leched","lecher","lechered","lecheries","lechering","lecherous","lecherously","lecherousness","lecherousnesses","lechers","lechery","leches","leching","lechwe","lechwes","lecithin","lecithinase","lecithinases","lecithins","lectern","lecterns","lectin","lectins","lection","lectionaries","lectionary","lections","lectisternia","lectisternium","lector","lectorate","lectorates","lectors","lectorship","lectorships","lectotype","lectotypes","lectress","lectresses","lecture","lectured","lecturer","lecturers","lectures","lectureship","lectureships","lecturing","lecturn","lecturns","lecythi","lecythidaceous","lecythis","lecythus","led","ledden","leddens","lederhosen","ledge","ledged","ledger","ledgered","ledgering","ledgers","ledges","ledgier","ledgiest","ledgy","ledum","ledums","lee","leear","leears","leeboard","leeboards","leech","leechcraft","leechcrafts","leechdom","leechdoms","leeched","leechee","leechees","leeches","leeching","leechlike","leed","leeing","leek","leeks","leep","leeped","leeping","leeps","leer","leered","leerier","leeriest","leerily","leeriness","leerinesses","leering","leeringly","leerings","leers","leery","lees","leese","leeses","leesing","leet","leetle","leets","leetspeak","leetspeaks","leeward","leewardly","leewards","leeway","leeways","leeze","left","lefte","lefter","leftest","leftie","lefties","leftish","leftism","leftisms","leftist","leftists","leftmost","leftmosts","leftover","leftovers","lefts","leftward","leftwardly","leftwards","leftwing","lefty","leg","legacies","legacy","legal","legalese","legaleses","legalisation","legalisations","legalise","legalised","legaliser","legalisers","legalises","legalising","legalism","legalisms","legalist","legalistic","legalistically","legalists","legalities","legality","legalization","legalizations","legalize","legalized","legalizer","legalizers","legalizes","legalizing","legally","legals","legataries","legatary","legate","legated","legatee","legatees","legates","legateship","legateships","legatine","legating","legation","legationary","legations","legatissimo","legato","legator","legatorial","legators","legatos","legend","legendaries","legendarily","legendary","legendise","legendised","legendises","legendising","legendist","legendists","legendize","legendized","legendizes","legendizing","legendries","legendry","legends","leger","legerdemain","legerdemainist","legerdemainists","legerdemains","legering","legerings","legerities","legerity","legers","leges","legge","legged","legger","leggers","legges","leggie","leggier","leggiero","leggies","leggiest","leggin","legginess","legginesses","legging","legginged","leggings"];
        var l =  Math.floor(Math.random() * 10);
        for (var x = l ; x < l + Math.floor(Math.random() * num); x += 1) {
            out.push(words[Math.floor(Math.random() * words.length) % words.length]);
        }
        return out.join(' ');
    }
    var x,
        y,
        grid = canvasDatagrid({
            parentNode: document.body,
            debug: false,
            showPerformance: true,
            globalRowResize: true,
            multiLine: true
        });
    // grid.data = [
    //     {a: veryDifficult, b: 'smal', c: '1', d: '1 2 3 4 5', e: '1,2,3,4,5'}
    // ];
    // grid.addEventListener('expandtree', function (e) {
    //     e.treeGrid.data = getData('');
    // });
    // grid.style.columnHeaderCellHeight = 40;
    grid.style.cellHeight = 70;
    function getData(prefix) {
        var data = [];
        for (x = 0; x < 100; x += 1) {
            data[x] = {};
            for (y = 0; y < 100; y += 1) {
                data[x][String.fromCharCode(65 + y)] = randomWords();
            }
        }
        data[x - 1].A = 'EOF';
        data[x - 1][String.fromCharCode(65 + y - 1)] = 'EOF';
        return data;
    }
    grid.data = getData('');
    grid.addEventListener('beforerendercell', function (e) {
        e.cell.innerHTML = e.cell.value;
    });
    // for (x = 0; x < 40; x += 1) {
    //     // grid.schema[x].width = 500 * Math.random();
    //     // grid.schema[x].hidden = Math.random() > 0.5;
    // }

    // [0, 1, 2].forEach(function (x) {
    //     grid.schema[x].width = 100;
    //     grid.schema[x].hidden = false;
    // });
    // grid.schema[0].hidden = false;
    grid.style.height = '100%';
    grid.style.width = '100%';
    grid.style.cellWhiteSpace = 'normal';
    grid.style.cellHorizontalAlignment = 'right';
    grid.style.activeCellHorizontalAlignment = 'right';
    // grid.style.cellVerticalAlignment = 'top';
    // grid.style.activeCellVerticalAlignment = 'top';
    // grid.data[0][grid.schema[0].name] = difficult;
    // grid.data[0][grid.schema[1].name] = veryDifficult;
    //console.log(grid.columnOrder);
    //grid.columnOrder = [4, 3, 2, 1, 0];
    //console.log(grid.rowOrder);
    //grid.rowOrder = [4, 3, 2, 1, 0];
    // grid.style.height = 'auto';
    // grid.style.width = 'auto';
    // setTimeout(function () {
    //     grid.scrollIntoView(20, 75, .5, .5);
    // }, 1000);
}