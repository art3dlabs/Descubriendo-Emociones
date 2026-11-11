import React from 'react';
import { HostCharacter } from './HostCharacter';

interface RulesViewProps {
  onSwitchView: (view: 'presentation' | 'setup' | 'game' | 'ranking' | 'rules') => void;
}

export const RulesView: React.FC<RulesViewProps> = ({ onSwitchView }) => {
  return (
    <div className="space-y-6">
      <div className="max-w-4xl mx-auto">
        <HostCharacter
          expression="thinking"
          customMessage="Acá tenés el reglamento oficial de Descubriendo Emociones En Palabras. Recordá nuestra Regla de Oro: ¡escucha activa, empatía y cero juicios!"
        />
      </div>

      <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl shadow-xl border border-indigo-100 dark:border-indigo-800 p-6 md:p-8 max-w-4xl mx-auto backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
        <div className="text-center mb-8">
          <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full border border-indigo-200 dark:border-indigo-500/40">
            Reglamento Oficial y Modos de Juego
          </span>
          <h2 className="kids-font text-3xl md:text-5xl text-indigo-950 dark:text-white mt-2 font-extrabold">
            Descubriendo Emociones En Palabras
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1 max-w-xl mx-auto font-medium">
            Descubre cómo aprovechar al máximo las 150 preguntas y la dinámica grupal.
          </p>
        </div>

        {/* Rule of Gold Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border-2 border-indigo-200 dark:border-indigo-700 mb-8 space-y-2">
          <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-300 kids-font text-xl font-extrabold">
            <span className="text-2xl">🌟</span>
            <h3>Principio de Bidireccionalidad (Regla de Oro)</h3>
          </div>
          <p className="text-slate-700 dark:text-slate-200 text-sm md:text-base leading-relaxed font-medium">
            Tanto niños/as como jóvenes y adultos participan por igual. Cuando se extrae una pregunta, los integrantes responden o aportan su perspectiva, fomentando un espacio sin juicios ni correcciones, basado en la escucha activa, la empatía y la afectividad.
          </p>
        </div>

        {/* The 4 Game Modes */}
        <h3 className="kids-font text-2xl text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
          <span>🎮</span> Modos de Juego Incluidos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-indigo-50/80 dark:bg-slate-950/70 p-4 rounded-2xl border border-indigo-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300 text-base">
              <span>🎰</span>
              <span>1. Clásico con Ruleta</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Gira la ruleta virtual para que el azar decida la categoría de la pregunta y compartas con el grupo.
            </p>
          </div>

          <div className="bg-emerald-50/80 dark:bg-slate-950/70 p-4 rounded-2xl border border-emerald-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 text-base">
              <span>🤝</span>
              <span>2. Cooperativo / Misiones</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Ideal para cartas de Misiones Especiales, donde todo el grupo colabora en conjunto para superar consignas corporales o de expresión.
            </p>
          </div>

          <div className="bg-purple-50/80 dark:bg-slate-950/70 p-4 rounded-2xl border border-purple-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-purple-900 dark:text-purple-300 text-base">
              <span>🌙</span>
              <span>3. Rutina Nocturna</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Diseñado para momentos antes de dormir, extrayendo preguntas de calma, bienestar y reflexión relajada sobre el día.
            </p>
          </div>

          <div className="bg-amber-50/80 dark:bg-slate-950/70 p-4 rounded-2xl border border-amber-100 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-base">
              <span>⏱️</span>
              <span>4. Contrarreloj (30s)</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Pon a prueba la agilidad mental respondiendo de forma espontánea antes de que se agote el temporizador de 30 segundos.
            </p>
          </div>
        </div>

        {/* The 5 Categories */}
        <h3 className="kids-font text-2xl text-slate-900 dark:text-white font-bold mb-4 flex items-center gap-2">
          <span>📚</span> Categorías de las 150 Preguntas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <h4 className="kids-font font-bold text-indigo-900 dark:text-indigo-300 mb-1 text-base">
              💖 Relaciones Mágicas
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Vínculos familiares, amigos, afectos y convivencia cotidiana. (30 preguntas)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800">
            <h4 className="kids-font font-bold text-purple-900 dark:text-purple-300 mb-1 text-base">
              🌍 Mi Mundo
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Percepción del entorno, escuela, sueños y visión personal. (30 preguntas)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/50 border border-pink-200 dark:border-pink-800">
            <h4 className="kids-font font-bold text-pink-900 dark:text-pink-300 mb-1 text-base">
              🌊 Mar de Emociones
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Autoconocimiento, gestión de emociones, miedos y alegrías. (30 preguntas)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800">
            <h4 className="kids-font font-bold text-amber-900 dark:text-amber-300 mb-1 text-base">
              🎁 Caja de Sorpresas
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Curiosidades, dilemas divertidos y reflexiones inesperadas. (30 preguntas)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 sm:col-span-2 lg:col-span-1">
            <h4 className="kids-font font-bold text-emerald-900 dark:text-emerald-300 mb-1 text-base">
              ⭐ Misiones Especiales
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Dinámicas en acción, mímica, postura, gratitud y juegos breves. (30 consignas)
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => onSwitchView('game')}
            className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-extrabold px-8 py-4 rounded-2xl transition kids-font text-lg shadow-xl cursor-pointer inline-flex items-center gap-2"
          >
            <span>¡Entendido! Ir al Tablero & Ruleta</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
