'use strict';

// Читаем содержимое package.json в константу
const pjson = require('./package.json');
// Получим из константы другую константу с адресами папок сборки и исходников
const dirs = pjson.config.directories;

// Определим необходимые инструменты
const gulp = require('gulp');
const nodemon = require('nodemon');
const sass = require("gulp-sass");
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const replace = require('gulp-replace');
const del = require('del');
const browserSync = require('browser-sync').create();
const ghPages = require('gulp-gh-pages');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cheerio = require('gulp-cheerio');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-cleancss');

// ЗАДАЧА: Компиляция препроцессора
gulp.task('sass', function(){
  return gulp.src(dirs.source + '/sass/style.scss')         // какой файл компилировать (путь из константы)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())                                // инициируем карту кода
    .pipe(sass())                                           // компилируем
    .pipe(postcss([                                         // делаем постпроцессинг
        autoprefixer({ browsers: ['last 2 version'] }),     // автопрефиксирование
        mqpacker({ sort: true }),                           // объединение медиавыражений
    ]))
    .pipe(sourcemaps.write('/'))                            // записываем карту кода как отдельный файл (путь из константы)
    .pipe(gulp.dest(dirs.build + '/stylesheets/'))                  // записываем CSS-файл (путь из константы)
    .pipe(browserSync.stream())
    .pipe(rename('style.min.css'))                          // переименовываем
    .pipe(cleanCSS())                                       // сжимаем
    .pipe(gulp.dest(dirs.build + '/stylesheets/'));                 // записываем CSS-файл (путь из константы)
});

// ЗАДАЧА: Сборка HTML
gulp.task('ejs', function() {
  return gulp.src(dirs.source + '/*.ejs')                  // какие файлы обрабатывать (путь из константы, маска имени)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(replace(/\n\s*<!--DEV[\s\S]+?-->/gm, ''))         // убираем комментарии <!--DEV ... -->
    .pipe(gulp.dest(dirs.ejs));                           // записываем файлы (путь из константы)
});

// ЗАДАЧА: Копирование изображений
gulp.task('img', function () {
  return gulp.src([
        dirs.source + '/img/*.{gif,png,jpg,jpeg,svg}',      // какие файлы обрабатывать (путь из константы, маска имени, много расширений)
      ],
      {since: gulp.lastRun('img')}                          // оставим в потоке обработки только изменившиеся от последнего запуска задачи (в этой сессии) файлы
    )
    .pipe(plumber({ errorHandler: onError }))
    .pipe(newer(dirs.build + '/images'))                       // оставить в потоке только новые файлы (сравниваем с содержимым папки билда)
    .pipe(gulp.dest(dirs.build + '/images'));                  // записываем файлы (путь из константы)
});

// ЗАДАЧА: Оптимизация изображений (ЗАДАЧА ЗАПУСКАЕТСЯ ТОЛЬКО ВРУЧНУЮ)
gulp.task('img:opt', function () {
  return gulp.src([
      dirs.source + '/img/*.{gif,png,jpg,jpeg,svg}',        // какие файлы обрабатывать (путь из константы, маска имени, много расширений)
      '!' + dirs.source + '/img/sprite-svg.svg',            // SVG-спрайт брать в обработку не будем
    ])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(imagemin({                                        // оптимизируем
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(dirs.source + '/img'));                  // записываем файлы в исходную папку
});

// ЗАДАЧА: Сборка SVG-спрайта
gulp.task('svgstore', function (callback) {
  let spritePath = dirs.source + '/img/svg-sprite';          // переменнач с путем к исходникам SVG-спрайта
  if(fileExist(spritePath) !== false) {
    return gulp.src(spritePath + '/*.svg')                   // берем только SVG файлы из этой папки, подпапки игнорируем
      // .pipe(plumber({ errorHandler: onError }))
      .pipe(svgmin(function (file) {
        return {
          plugins: [{
            cleanupIDs: {
              minify: true
            }
          }]
        }
      }))
      .pipe(svgstore({ inlineSvg: true }))
      .pipe(cheerio(function ($) {
        $('svg').attr('style',  'display:none');             // дописываем получающемуся SVG-спрайту инлайновое сокрытие
      }))
      .pipe(rename('sprite-svg.svg'))
      .pipe(gulp.dest(dirs.source + '/img'));
  }
  else {
    console.log('Нет файлов для сборки SVG-спрайта');
    callback();
  }
});

// ЗАДАЧА: Очистка папки сборки
gulp.task('clean', function () {
  return del([                                              // стираем
    dirs.build + '/**/*',                                   // все файлы из папки сборки (путь из константы)
    '!' + dirs.build + '/readme.md'                         // кроме readme.md (путь из константы)
  ]);
});

// ЗАДАЧА: Конкатенация и углификация Javascript
gulp.task('js', function () {
  return gulp.src([
      // список обрабатываемых файлов в нужной последовательности
      dirs.source + '/js/form.js',
      dirs.source + '/js/validate.js',
      dirs.source + '/js/request.js'
    ])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dirs.build + '/javascripts/'))
    .pipe(browserSync.stream())
    .pipe(rename('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dirs.build + '/javascripts'));
});

// ЗАДАЧА: Перемещение шрифтов
gulp.task('copy', function() {
  return gulp.src([
      dirs.source + '/fonts/**/*.{woff,woff2}'
    ], {
      base: '.'
    })
    .pipe(gulp.dest('public'));
});

// ЗАДАЧА: Сборка всего
gulp.task('build', gulp.series(                             // последовательно:
  'clean',                                                  // последовательно: очистку папки сборки
  'svgstore',
  gulp.parallel('sass', 'img', 'js', 'copy')                                                    // последовательно: сборку разметки
));

gulp.task('nodemon', function (callback) {

  var started = false;

  return nodemon({
    script: 'server.js'
  }).on('start', function () {
    if (!started) {
      callback();
      started = true;
    }
  });
});

// ЗАДАЧА: Локальный сервер, слежение
gulp.task('serve', gulp.series('nodemon', 'build', function() {

  browserSync.init(null, {
    proxy: "http://localhost:3003",
        files: ["public/**/*.*"],
        port: 3000,
  });

  gulp.watch(                                               // следим
    dirs.source + '/sass/**/*.scss',
    gulp.series('sass')                                     // при изменении запускаем компиляцию (обновление браузера — в задаче компиляции)
  );

  // gulp.watch(                                               // следим за SVG
  //   dirs.source + '/img/svg-sprite/*.svg',
  //   gulp.series('svgstore', 'html', reloader)
  // );

  gulp.watch(                                               // следим за изображениями
    dirs.source + '/img/*.{gif,png,jpg,jpeg,svg}',
    gulp.series('img', reloader)                            // при изменении оптимизируем, копируем и обновляем в браузере
  );

  gulp.watch(                                               // следим за JS
    dirs.source + '/js/*.js',
    gulp.series('js', reloader)                            // при изменении пересобираем и обновляем в браузере
  );

}));

// ЗАДАЧА, ВЫПОЛНЯЕМАЯ ТОЛЬКО ВРУЧНУЮ: Отправка в GH pages (ветку gh-pages репозитория)
gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});

// ЗАДАЧА: Задача по умолчанию
gulp.task('default',
  gulp.series('serve')
);

// Дополнительная функция для перезагрузки в браузере
function reloader(done) {
  browserSync.reload();
  done();
}

// Проверка существования файла/папки
function fileExist(path) {
  const fs = require('fs');
  try {
    fs.statSync(path);
  } catch(err) {
    return !(err && err.code === 'ENOENT');
  }
}

var onError = function(err) {
  notify.onError({
    title: 'Error in ' + err.plugin,
  })(err);
  this.emit('end');
};
