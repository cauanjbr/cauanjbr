const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const text = (x,y,s,size=20,color='#a9bbd0',extra='') => `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(s)}</text>`;
function typed(s,y,size=32,color='#f0f6fc') {
  const width = Math.min(840, Math.ceil(s.length*size*.62)+8);
  const widths = Array.from({length:s.length+1},(_,i)=>Math.round(width*i/s.length));
  const times = widths.map((_,i)=>(.3*i/(widths.length-1)).toFixed(5));
  return `<defs><clipPath id="type-${y}"><rect x="40" y="${y-size}" width="${width}" height="${size+12}"><animate attributeName="width" calcMode="discrete" values="${widths.join(';')};${width};0" keyTimes="${times.join(';')};0.96;1" dur="12s" repeatCount="indefinite"/></rect></clipPath></defs><g clip-path="url(#type-${y})">${text(40,y,s,size,color,'font-family="Consolas,monospace" font-weight="700"')}</g>`;
}
function shell(title,height,accent,content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="${height}" viewBox="0 0 960 ${height}" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(title)}. Cartão com digitação e luz em movimento.</desc>
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0d1117"/><stop offset="1" stop-color="#132132"/></linearGradient><linearGradient id="line"><stop stop-color="${accent}" stop-opacity="0"/><stop offset=".5" stop-color="${accent}"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></linearGradient><pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#8ab4d4" stroke-opacity=".035"/></pattern></defs>
<style>text{font-family:Segoe UI,Arial,sans-serif} @media(prefers-reduced-motion:reduce){.decoration{display:none}}</style>
<rect x="1" y="1" width="958" height="${height-2}" rx="18" fill="url(#bg)" stroke="#2c3a4e"/><rect x="1" y="1" width="958" height="${height-2}" rx="18" fill="url(#grid)"/>
<svg x="20" y="1" width="920" height="3" overflow="hidden" class="decoration"><rect width="210" height="3" fill="url(#line)"><animate attributeName="x" values="-210;920" dur="7s" repeatCount="indefinite"/></rect></svg>
<g>${content}</g>
</svg>\n`;
}
function chips(labels,y,accent) {
  let x=40;
  return labels.map((s,i)=>{
    const w=Math.ceil(s.length*9+30), current=x; x+=w+10;
    return `<g><rect x="${current}" y="${y}" width="${w}" height="32" rx="8" fill="#182536" stroke="${accent}" stroke-opacity=".28"><animate attributeName="stroke-opacity" values=".2;.7;.2" dur="5s" begin="${i*.4}s" repeatCount="indefinite"/></rect>${text(current+15,y+21,s,14,'#dce8f7')}</g>`;
  }).join('');
}
function write(name,svg) { fs.writeFileSync(path.join(root,'assets',name+'.svg'),svg); }

write('about',shell('Sobre mim — CDC Bank e Inteligência Artificial',275,'#38bdf8',
text(40,37,'01 / PERFIL',12,'#7dd3fc','letter-spacing="3"')+typed('Tecnologia & Inteligência Artificial',90,30)+
text(40,133,'Atuo na área de tecnologia na CDC Bank.',22,'#e2e8f0')+
text(40,167,'Sou estudante de Inteligência Artificial e desenvolvo projetos',20)+
text(40,198,'pessoais para a web, conectando código, dados e aplicações.',20)+
text(40,238,'Curiosidade para explorar. Dedicação para construir.',18,'#7dd3fc')));

write('technology',shell('Tecnologias — PHP, CodeIgniter, MySQL e ferramentas web',245,'#a78bfa',
text(40,37,'02 / TECNOLOGIAS',12,'#c4b5fd','letter-spacing="3"')+typed('Da interface ao banco de dados.',90,30)+
chips(['PHP','CodeIgniter 3','MySQL','HTML','CSS','Bootstrap'],123,'#a78bfa')+
chips(['Git','GitHub','VS Code','XAMPP','MVC'],172,'#38bdf8')));

write('projects',shell('Projetos e repositórios',118,'#38bdf8',
text(40,32,'03 / PORTFÓLIO',12,'#7dd3fc','letter-spacing="3"')+typed('Código que vira projeto.',83,32)));

function project({file,title,repo,accent,number,lines,tags,featured=false}) {
 const height=featured?335:285;
 let body=text(40,38,number+' / '+(featured?'PROJETO EM DESTAQUE':'REPOSITÓRIO'),12,accent,'letter-spacing="2"');
 body+=typed(title,92,36);
 body+=text(40,125,'cauanjbr / '+repo,16,'#7991ad','font-family="Consolas,monospace"');
 lines.forEach((s,i)=>{body+=text(40,167+i*30,s,20);});
 body+=chips(tags,height-91,accent);
 body+=`<path d="M40 ${height-44}H920" stroke="#2b3a4e"/>`;
 body+=text(40,height-18,'ABRIR REPOSITÓRIO',12,accent,'letter-spacing="2"');
 body+=`<g class="decoration"><path d="M879 ${height-24}h22m-7-7 7 7-7 7" stroke="${accent}" stroke-width="2" fill="none"><animateTransform attributeName="transform" type="translate" values="0 0;7 0;0 0" dur="2.5s" repeatCount="indefinite"/></path></g>`;
 write(file,shell(title+' — '+repo,height,accent,body));
}
project({file:'project-library',title:'Biblioteca digital',repo:'curso-codeigniter',accent:'#38bdf8',number:'01',featured:true,lines:['Catálogo público e painel de gerenciamento de livros e usuários.','Login e sessões · cadastro, edição, exclusão e status dos livros.','Upload de capas · autoria e resumos integrados ao MySQL.'],tags:['PHP','CodeIgniter 3','MySQL','Bootstrap']});
project({file:'project-adv',title:'Site ADV',repo:'site-adv',accent:'#c4b5fd',number:'02',lines:['Projeto de site com HTML.'],tags:['HTML','Desenvolvimento web']});
project({file:'project-gitrepo',title:'Gitrepo2',repo:'gitrepo2',accent:'#5eead4',number:'03',lines:['Exercícios de desenvolvimento e versionamento de código.'],tags:['HTML','Git','GitHub']});
write('footer',shell('Explore todos os meus repositórios',100,'#a78bfa',typed('Continue explorando meus projetos →',61,27,'#c4b5fd')));
write('contact-email',shell('Contato por e-mail: cauanoliveirauai1705@gmail.com',115,'#38bdf8',text(40,33,'04 / CONTATO · E-MAIL',12,'#7dd3fc','letter-spacing="2"')+typed('cauanoliveirauai1705@gmail.com',82,27)));
write('contact-instagram',shell('Instagram: @cauanjbr',115,'#c4b5fd',text(40,33,'INSTAGRAM',12,'#c4b5fd','letter-spacing="2"')+typed('@cauanjbr',82,27)));
write('contact-whatsapp',shell('WhatsApp: +55 (31) 98502-8861',115,'#5eead4',text(40,33,'WHATSAPP',12,'#5eead4','letter-spacing="2"')+typed('+55 (31) 98502-8861',82,27)));
console.log('10 cartões SVG gerados.');
