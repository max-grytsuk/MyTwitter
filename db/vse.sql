-- phpMyAdmin SQL Dump
-- version 3.3.8.1
-- http://www.phpmyadmin.net
--
-- Хост: 
-- Время создания: Апр 16 2011 г., 17:32
-- Версия сервера: 5.1.51
-- Версия PHP: 5.2.14

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- База данных: `drer_vse`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tweeters_relations`
--

CREATE TABLE IF NOT EXISTS `tweeters_relations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idTweeter` int(10) unsigned NOT NULL,
  `idFollowing` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tweeters_relations_1` (`idTweeter`),
  KEY `FK_tweeters_relations_2` (`idFollowing`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=56 ;
 --------------------------------------------------------

--
-- Структура таблицы `tweets`
--

CREATE TABLE IF NOT EXISTS `tweets` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `time` datetime NOT NULL,
  `idOwner` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_tweets_1` (`idOwner`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=158 ;

--
-- Структура таблицы `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `avatar` varchar(45) DEFAULT NULL,
  `activation` int(45) DEFAULT NULL,
  `creation_date` datetime NOT NULL,
  `info` text CHARACTER SET utf8,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=27 ;

--
-- Ограничения внешнего ключа таблицы `tweeters_relations`
--
ALTER TABLE `tweeters_relations`
  ADD CONSTRAINT `FK_tweeters_relations_1` FOREIGN KEY (`idTweeter`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FK_tweeters_relations_2` FOREIGN KEY (`idFollowing`) REFERENCES `users` (`id`);

--
-- Ограничения внешнего ключа таблицы `tweets`
--
ALTER TABLE `tweets`
  ADD CONSTRAINT `FK_tweets_1` FOREIGN KEY (`idOwner`) REFERENCES `users` (`id`);
