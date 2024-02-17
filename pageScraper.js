const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');

const scraperObject = {
  async scraper(browser, url) {
    // const context = await browser.createIncognitoBrowserContext(); //aba anônima
    let page = await browser.newPage();
    await page.setViewport({ width: 720, height: 720, deviceScaleFactor: 1 });
    await page.setUserAgent(randomUseragent.getRandom()); // altera ID do navegador
    console.log(`ABRINDO BROWSER PAGE PARA URL ${url}...`);
    try {
      await page.goto(url);
    } catch {
    }
    let scrapedData = [];
    let urls;
    try {
      await page.waitForSelector('.lister-list');
      urls = await page.$$eval('h3.lister-item-header', (links) => {
        return links.map((el) => el.querySelector('a').href ?? '?');
      });
    } catch {
    }
   
    let scrapeCastCrewPage = (link) =>
      new Promise(async (resolve, reject) => {
        let pageMovieDetails = {};
        let newPage = await browser.newPage();
        console.log(`ABRINDO PÁGINA DO FILME =  ${url}...`);
        await newPage.setViewport({ width: 1970, height: 1080, deviceScaleFactor: 1 });
        await newPage.setUserAgent(randomUseragent.getRandom()); // altera ID do navegador
        console.log(`Navigating to ${link}...`);
        try {
          await newPage.goto(link);
        } catch {
          pageMovieDetails.title = 'Link incorreto';
          console.log("Link incorreto");
        }
        try {
          let countryList = await newPage.$$eval(
            '[data-testid="title-details-origin"]',
            (itens) => (itens = itens.map((item) => item.querySelector('div > ul > li > a').textContent ?? '?'))
          );
          pageMovieDetails.country = countryList.join().replace(/,/g, '||').trim();
        } catch {
          pageMovieDetails.countryList = 'Campo vazio';
        }
        let castCrew;
        try {
          await newPage.waitForSelector('[data-testid="hero-subnav-bar-right-block"]');
          castCrew = await newPage.$eval('[data-testid="hero-subnav-bar-right-block"] > ul > li> a', (text) => text.href ?? '?');
        } catch {
          pageMovieDetails.castCrew = 'Seção cast&Crew vazia ';
        }
        try {
          await newPage.goto(castCrew, { delay: Math.floor(Math.random() * 1000 + 1) });
          pageMovieDetails.castCrew = castCrew.trim();
        } catch {
          console.log("Seção cast&Crew vazia");
        }
        let nomeDoFilme;
        try {
          nomeDoFilme = await newPage.$eval('[itemprop="name"] > a', (item) => item.textContent ?? '?');
          pageMovieDetails.nomeDoFilme = nomeDoFilme.trim();
        } catch {
          pageMovieDetails.nomeDoFilme = 'Campo vazio';
        }
        let anoDeLancamento;
        try {
          anoDeLancamento = await newPage.$eval(
            '#main > div.article.listo > div.subpage_title_block > div > div.parent > h3 > span',
            (item) => item.textContent ?? '?'
          );
          pageMovieDetails.anoDeLancamento = anoDeLancamento.trim();
        } catch {
          pageMovieDetails.anoDeLancamento = 'Campo vazio';
        }

        let diretores;
        try {
          diretores = await newPage.$$eval('#director+ .simpleCreditsTable a', (listaDeItens) => {
            return listaDeItens.map((item) => item.textContent ?? '?');
          });
          pageMovieDetails.diretores = diretores.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.diretores = 'Campo vazio';
        }

        let elenco;
        try {
          elenco = await newPage.$$eval('.primary_photo > a > img', (listaDeItens) => {
            return listaDeItens.map((item) => item.getAttribute('alt') ?? '?');
          });
          pageMovieDetails.elenco = elenco.join().replace(/,/g, '||').trim();
        } catch {
          pageMovieDetails.elenco = 'Campo vazio';
        }

        let musicos;
        try {
          musicos = await newPage.$$eval('[name="composer"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.musicos = musicos.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.musicos = 'Campo vazio';
        }

        let nomedalet;
        try {
          edicaoDeArte = await newPage.$$eval('[name="art_director"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.edicaoDeArte = edicaoDeArte.join().replace(/,/g, '||').trim();
        } catch {
          pageMovieDetails.nomedalet = 'Campo vazio';
        }

        let departamentoDeSom;
        try {
          departamentoDeSom = await newPage.$$eval('[name="sound_department"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.departamentoDeSom = departamentoDeSom.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.departamentoDeSom = 'Campo vazio';
        }

        let departamentoDeCamera;
        try {
          departamentoDeCamera = await newPage.$$eval('[name="camera_department"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.departamentoDeCamera = departamentoDeCamera.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.departamentoDeCamera = 'Campo vazio';
        }

        let departamentoEditorial;
        try {
          departamentoEditorial = await newPage.$$eval('[name="editorial_department"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.departamentoEditorial = departamentoEditorial.join().replace(/\n/g, '').replace(/ , /g, '||').trim();
        } catch {
          pageMovieDetails.departamentoEditorial = 'Campo vazio';
        }

        let departamentoDeMusica;
        try {
          departamentoDeMusica = await newPage.$$eval('[name="music_department"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.departamentoDeMusica = departamentoDeMusica.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.departamentoDeMusica = 'Campo vazio';
        }

        let miscelania;
        try {
          miscelania = await newPage.$$eval('[name="miscellaneous"] + table > tbody >tr', (listaDeItens) => {
            return listaDeItens.map((item) => item.querySelector('td.name > a').textContent ?? '?');
          });
          pageMovieDetails.miscelania = miscelania.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {
          pageMovieDetails.miscelania = 'Campo vazio';
        }

        let sidebarLinks;
        try {
          sidebarLinks = await newPage.$$eval('#full_subnav > ul.quicklinks > li > a', (listaDeItens) => {
            return listaDeItens.map((item) => item?.href ?? '?');
          });
          pageMovieDetails.sidebarLinks = sidebarLinks.join().replace(/\n/g, '').replace(/, /g, '||').trim();
        } catch {}
        let plotLink;
        try {
          plotLink = sidebarLinks.filter((item) => item.indexOf('plotsummary') != -1);
          pageMovieDetails.plotLink = plotLink.join().replace(/,/g, '||').trim();
        } catch {
          // console.log("Campo vazio");
          pageMovieDetails.plotLink = 'Campo vazio';
        }
        let keywordLink;
        try {
          keywordLink = sidebarLinks.filter((item) => item.indexOf('keywords') != -1);
          pageMovieDetails.keywordLink = keywordLink.join().replace(/,/g, '||').trim();
          // console.log(keywordLink);
        } catch {
          // console.log("Campo vazio");
          pageMovieDetails.keywordLink = 'Campo vazio';
        }
        let galleryLink;
        try {
          galleryLink = sidebarLinks.filter((item) => item.indexOf('mediaindex') != -1);
          pageMovieDetails.galleryLink = galleryLink.join().replace(/,/g, '||').trim();
          // console.log(galleryLink);
        } catch {
          // console.log("Campo vazio");
          pageMovieDetails.galleryLink = 'Campo vazio';
        }
        let externalSiteLink;
        try {
          externalSiteLink = sidebarLinks.filter((item) => item.indexOf('externalsites') != -1);
          pageMovieDetails.externalSiteLink = externalSiteLink.join().replace(/,/g, '||').trim();
          // console.log(externalSiteLink);
        } catch {
          // console.log("Campo vazio");
          pageMovieDetails.externalSiteLink = 'Campo vazio';
        }

        //    return pageMovieDetails;
        // });

        await newPage.close();
        resolve(pageMovieDetails); //RETORNO DA PAGE PROMISE
      });
    let currentPageData;
    urls.forEach((url) => {});

    for (link in urls) {
      currentPageData = await scrapeCastCrewPage(urls[link]);
      let newPage = await browser.newPage();
      let enredo;
      try {
        await newPage.goto(currentPageData.plotLink);
        // console.log(`ABRINDO NEWPAGE PARA PÁGINA DO PLOT DO FILME =  ${url}...`);
        await newPage.waitForSelector('#plot-summaries-content > li > p');
        enredo = await newPage.$eval('#plot-summaries-content > li > p', (text) => text.textContent ?? '?');
        currentPageData.enredo = enredo;
      } catch {
        currentPageData.enredo = 'Campo vazio';
        // console.log("ERRO NA CAPTURA DO ENREDO");
        // scrapedData.push(currentPageData);
      }

      let enredoTraduzido;
      try {
        // console.log(`NAVEGANDO PARA O GOOGLE TRADUTOR =  ${url}...`);
        await newPage.goto('https://www.google.com/search?client=opera&q=google+tradutor&sourceid=opera&ie=UTF-8&oe=UTF-8');
        await newPage.waitForSelector('#tw-source-text-ta');
        await newPage.click('#tw-source-text-ta'); //atribuir valor
        await newPage.keyboard.type(currentPageData.enredo);
        await newPage.waitForSelector('#tw-target-text > span');
        await newPage.waitForTimeout(3000);
        enredoTraduzido = await newPage.$eval('#tw-target-text > span', (text) => text.textContent ?? '?');
        currentPageData.enredoTraduzido = enredoTraduzido;
        // newPage.close();
      } catch {
        currentPageData.enredoTraduzido = 'Campo vazio';
        // console.log("ERRO NA TRADUÇÃO DO ENREDO");
      }
      console.log(currentPageData);
      // await newPage.close();
      try {
        await newPage.goto(currentPageData.keywordLink);
        let listaPalavrasChave = await newPage.$$eval('.sodatext a', (keywords) => {
          return keywords.map((keyword) => keyword.textContent ?? '?');
        });
        currentPageData.palavrasChaves = listaPalavrasChave.join().replace(/,/g, '||').trim();
      } catch {
        currentPageData.palavrasChaves = 'Campo vazio';
      }
      try {
        await newPage.goto(currentPageData.galleryLink);
        let listaDeImagens = await newPage.$$eval('#media_index_thumbnail_grid > a > img', (imgs) => {
          return imgs.map((img) => img.src ?? '?');
        });
        currentPageData.listaDeImagens = listaDeImagens.join().replace(/.jpg,/g, '.jpg ||').trim();
        // currentPageData.listaDeImagens = listaDeImagens.join().replace(/,/g, "||").trim();
      } catch {
        currentPageData.listaDeImagens = 'Campo vazio';
      }
      try {
        await newPage.goto(currentPageData.externalSiteLink);
        let listaSitesExternos = await newPage.$$eval('.tracked-offsite-link', (imgs) => {
          return imgs.map((img) => img.href ?? '?');
        });
        currentPageData.sitesExternos = listaSitesExternos.join().replace(/,/g, '||').trim();
      } catch {
        currentPageData.listaSitesExternos = 'Campo vazio';
      }
      dayName = new Array('domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado');
      monName = new Array('janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'agosto', 'outubro', 'novembro', 'dezembro');
      now = new Date();
      currentPageData.update = new Date();

      await newPage.close();

      scrapedData.push(currentPageData);

      console.log(scrapedData);
    }
    await page.close();

    return scrapedData;
  },
};

module.exports = scraperObject;
