import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqSection } from './faq-section';

describe('FaqSection', () => {
  let component: FaqSection;
  let fixture: ComponentFixture<FaqSection>;

  beforeEach(async () => {
    // Les questions sont révélées au défilement (`animateOnScroll`), et l'environnement de
    // test n'a pas d'IntersectionObserver. Un observateur inerte suffit : ce qui est vérifié
    // ici, c'est le balisage, pas l'animation.
    globalThis.IntersectionObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    } as unknown as typeof IntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [FaqSection],
    }).compileComponents();

    fixture = TestBed.createComponent(FaqSection);
    component = fixture.componentInstance;
    // `items` est requis : le composant lit l'entrée dès son ngOnInit, pour poser les
    // données structurées.
    fixture.componentRef.setInput('items', [{ question: 'Q ?', answer: 'R.' }]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pose un balisage FAQPage dans le <head>', () => {
    const script = document.head.querySelector('script#faq-schema');
    expect(script).toBeTruthy();
    expect(JSON.parse(script!.textContent ?? '{}')['@type']).toBe('FAQPage');
  });

  it('retire le balisage quand la section disparaît', () => {
    fixture.destroy();
    expect(document.head.querySelector('script#faq-schema')).toBeNull();
  });
});
