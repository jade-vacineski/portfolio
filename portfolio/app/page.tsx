"use client";

import { type TouchEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import WorkIcon from "@mui/icons-material/Work";

export default function Home() {
  const rootRef = useRef<HTMLDivElement>(null);
  const carouselTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [projectSlide, setProjectSlide] = useState(0);
  const projectSlidesCount = 2;

  const goToProjectSlide = (index: number) => {
    const normalized = (index + projectSlidesCount) % projectSlidesCount;
    setProjectSlide(normalized);
  };

  const onProjectTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    carouselTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onProjectTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const start = carouselTouchStartRef.current;
    carouselTouchStartRef.current = null;
    if (!start) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Prioriza o scroll vertical; só troca slide em gesto horizontal claro.
    if (absX < 35 || absX <= absY) return;

    goToProjectSlide(deltaX < 0 ? projectSlide + 1 : projectSlide - 1);
  };

  useLayoutEffect(() => {
    const resetScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (rootRef.current) {
        rootRef.current.scrollTop = 0;
      }
    };

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
    resetScroll();
    requestAnimationFrame(resetScroll);
    setTimeout(resetScroll, 40);
    setTimeout(resetScroll, 120);

    const onPageShow = () => resetScroll();
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    const panels = Array.from(
      document.querySelectorAll<HTMLElement>(".panel"),
    );
    if (!panels.length) return;

    let locked = false;
    let lockTimer: number | undefined;

    const currentPanelIndex = () => {
      const y = window.scrollY + window.innerHeight * 0.35;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      panels.forEach((panel, index) => {
        const distance = Math.abs(panel.offsetTop - y);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      return bestIndex;
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 960) return;
      if (event.ctrlKey || event.metaKey) return;
      if (Math.abs(event.deltaY) < 8) return;

      event.preventDefault();
      if (locked) return;

      const current = currentPanelIndex();
      const target =
        event.deltaY > 0
          ? Math.min(current + 1, panels.length - 1)
          : Math.max(current - 1, 0);

      if (target === current) return;

      locked = true;
      panels[target].scrollIntoView({ behavior: "smooth", block: "start" });

      lockTimer = window.setTimeout(() => {
        locked = false;
      }, 650);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (lockTimer) window.clearTimeout(lockTimer);
    };
  }, []);

  useEffect(() => {
    const aboutSection = document.getElementById("sobre");
    if (!aboutSection) return;
    const aboutLines = aboutSection.querySelectorAll<HTMLElement>(".about-line");

    aboutLines.forEach((line) => {
      const text = (line.textContent ?? "").trim();
      line.setAttribute("data-text", text);
    });

    const onVisible = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutSection.classList.add("is-visible");
          } else {
            aboutSection.classList.remove("is-visible");
          }
        });
      },
      { threshold: 0.35 },
    );

    onVisible.observe(aboutSection);
    return () => onVisible.disconnect();
  }, []);

  return (
    <div className="portfolio-ui" ref={rootRef}>
      <main className="ui-shell">
        <section className="panel hero-panel" id="topo">
          <header className="ui-top">
            <nav className="ui-nav">
              <a href="#sobre">Sobre</a>
              <a href="#projeto-principal">Projetos</a>
              <a href="#stack">Stack</a>
            </nav>
          </header>

          <div className="ui-hero">
            <div className="ui-side-left">

            </div>

            <div className="ui-main">
              <div className="ui-copy">
                <p className="eyebrow">Portfólio</p>
                <h1>Ajadne Vacineski</h1>
                <p className="role">Software Engineer</p>

                <div className="hero-actions">
                  <a href="mailto:jadenogueira8881@gmail.com">Email</a>
                  <a href="https://www.linkedin.com/in/ajadnevacineski/" target="_blank" rel="noreferrer">
                    LinkedIn
                  </a>
                  <a href="https://github.com/jade-vacineski" target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                  <a href="#" target="_blank" rel="noreferrer">
                    CV
                  </a>
                </div>
              </div>

              <div className="ui-photo-wrap">
                <div className="ui-photo" aria-label="Foto de perfil">
                  <Image
                    src="/WhatsApp Image 2026-02-18 at 18.16.27.jpeg"
                    alt="Foto de Ajadne Vacineski"
                    fill
                    priority
                    sizes="(max-width: 960px) 100vw, 38vw"
                    className="ui-photo-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section panel" id="sobre">
          <h2>Sobre</h2>
          <div className="about-text">
            <p className="about-line">
              Software Engineer com experiência na construção e evolução de APIs
              REST, integrações e aplicações orientadas a regras de negócio em
              ambientes corporativos.
            </p>
            <p className="about-line">
              Atuo com foco em backend utilizando Java (Spring e Quarkus) e
              Node.js (NestJS), desenvolvendo sistemas em produção com atenção a
              performance, confiabilidade, observabilidade e aplicação consistente
              de boas práticas de engenharia.
            </p>
            <p className="about-line">
              Também possuo experiência como Fullstack, atuando com React e
              Angular na construção e integração de interfaces conectadas a APIs,
              garantindo coerência entre front-end e back-end.
            </p>
            <p className="about-line">
              Tenho vivência com SQL e NoSQL, monitoramento com Datadog,
              versionamento com Git e contato com AWS.
            </p>
            <p className="about-line">
              Sou criadora do RETAG, produto próprio em produção, onde atuo desde
              a definição do problema até decisões de arquitetura, modelagem de
              domínio, integração entre serviços, deploy e evolução contínua da
              aplicação.
            </p>
          </div>
        </section>

        <section className="section panel" id="projeto-principal">
          <h2>Projetos</h2>
            <div className="project-layout">
              <div
                className="project-carousel"
                onTouchStart={onProjectTouchStart}
                onTouchEnd={onProjectTouchEnd}
              >
              <div className="project-stage">
                {projectSlide === 0 ? (
                  <aside className="project-showcase" aria-label="Banner do projeto RETAG">
                    <figure className="project-banner">
                      <Image
                        src="/banner1.1 (1).png"
                        alt="Banner principal do RETAG"
                        width={1920}
                        height={1080}
                        priority
                        sizes="(max-width: 960px) 100vw, 92vw"
                        className="project-banner-img"
                      />
                    </figure>
                  </aside>
                ) : (
                  <aside className="project-showcase" aria-label="Segundo banner do projeto RETAG">
                    <figure className="project-banner">
                      <Image
                        src="/banner.svg"
                        alt="Banner secundário do RETAG"
                        width={1920}
                        height={1080}
                        sizes="(max-width: 960px) 100vw, 92vw"
                        className="project-banner-img"
                      />
                    </figure>
                  </aside>
                )}
              </div>

              {projectSlide === 0 ? (
                <a
                  className="project-float-cta"
                  href="https://www.retaglab.com.br/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Acessar o projeto ↗
                </a>
              ) : null}
            </div>

            <div className="project-dots" aria-label="Navegação do carrossel">
              <button
                type="button"
                className={projectSlide === 0 ? "dot active" : "dot"}
                onClick={() => goToProjectSlide(0)}
                aria-label="Mostrar banner"
                aria-current={projectSlide === 0}
              />
              <button
                type="button"
                className={projectSlide === 1 ? "dot active" : "dot"}
                onClick={() => goToProjectSlide(1)}
                aria-label="Mostrar segundo banner"
                aria-current={projectSlide === 1}
              />
            </div>
          </div>
        </section>

        <section className="section panel" id="experiencia">
          <h2>Experiência</h2>
          <div className="exp-board">
            <div className="exp-col">
              <h3>Experiência Acadêmica</h3>
              <div className="exp-items">
                <article className="exp-item">
                  <span className="exp-icon">
                    <SchoolIcon fontSize="inherit" />
                  </span>
                  <div>
                    <h4>Bacharelado em Ciência da Computação</h4>
                    <p>UNINTER - 2022 a 2026</p>
                  </div>
                </article>
                <article className="exp-item">
                  <span className="exp-icon">
                    <CodeIcon fontSize="inherit" />
                  </span>
                  <div>
                    <h4>Iniciação Ciêntífica</h4>
                    <p>PUCRS - 2022 a 2025</p>
                  </div>
                </article>
              </div>
            </div>

            <div className="exp-col">
              <h3>Experiência Profissional</h3>
              <div className="exp-items">
                <article className="exp-item">
                  <span className="exp-icon">
                    <WorkIcon fontSize="inherit" />
                  </span>
                  <div>
                    <h4>Back End Engineer</h4>
                    <p>Datum- set 2025 a dez 2025</p>
                  </div>
                </article>
                <article className="exp-item">
                  <span className="exp-icon">
                    <WorkIcon fontSize="inherit" />
                  </span>
                  <div>
                    <h4>Full Stack Developer</h4>
                    <p>Syonet - fev 2025 a set 2025</p>
                  </div>
                </article>
                <article className="exp-item">
                  <span className="exp-icon">
                    <WorkIcon fontSize="inherit" />
                  </span>
                  <div>
                    <h4>Software Developer intern</h4>
                    <p>DB - out 2023 a fev 2025</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section className="section panel" id="stack">
          <h2>Stack Técnica</h2>
          <div className="stack-groups">
            <div>
              <h4>Backend</h4>
              <p>Java (Spring, Quarkus)</p>
              <p>Node.js (NestJS)</p>
              <p>REST APIs</p>
              <p>JWT</p>
            </div>
            <div>
              <h4>Frontend</h4>
              <p>React</p>
              <p>Next.js</p>
              <p>TypeScript</p>
            </div>
            <div>
              <h4>Banco de Dados</h4>
              <p>MySQL</p>
              <p>PostgreSQL</p>
            </div>
            <div>
              <h4>Cloud & Infra</h4>
              <p>Google Cloud</p>
              <p>AWS</p>
              <p>Azure DevOps</p>
            </div>
            <div>
              <h4>Observabilidade</h4>
              <p>Datadog</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
