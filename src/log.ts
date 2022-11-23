/* eslint-disable no-console */
import { clearScreenDown, cursorTo } from "readline";
import { TTY } from "./globs";
import { style } from "./style";
import { LogStyles, LogOptions } from "./types";

type LogType = "log" | "info" | "warn" | "error" | "debug";
type Logger = (
  message?: string,
  styles?: LogStyles[],
  options?: LogOptions
) => void;

const logCall = (
  type: LogType,
  raw?: string,
  {
    level = 0,
    preLines = raw ? 1 : 0,
    postLines = 0,
  }: LogOptions = {}
) => {
  const logType = console[type];

  if (typeof raw === "undefined") {
    logType();
    return;
  }

  /**
   * Open indentations.
   */
  for (let i = 0; i < level; i++) {
    console.group();
  }
  /**
   * Log preceding newlines.
   */
  for (let i = 0; i < preLines; i++) {
    console.log();
  }
  /**
   * Log the raw string.
   */
  logType(raw);
  /**
   * Log following newlines.
   */
  for (let i = 0; i < postLines; i++) {
    console.log();
  }
  /**
   * Close indentations.
   */
  for (let i = 0; i < level; i++) {
    console.groupEnd();
  }
};

export const log: Logger = (
  message,
  styles,
  { force = false, ...options } = {}
) => {
  logCall("log", style(message, styles, force), options);
};

export const success: Logger = (
  message,
  styles = [],
  { force = false, ...options } = {}
) => {
  logCall("log", style(message, ["green", ...styles], force), options);
};

export const error: Logger = (
  message,
  styles = [],
  { force = false, ...options } = {}
) => {
  logCall("error", style(message, ["red", ...styles], force), options);
};

const groupStart: Logger = (
  message,
  styles = [],
  { force = false } = {}
) => {
  if (!message) {
    return console.group();
  }

  console.log();
  console.log();
  console.group(style(message, ["bold", ...styles], force));
};

const groupEnd: Logger = () => {
  console.groupEnd();
};

export const group = {
  start: groupStart,
  end: groupEnd,
};

/**
 * Mark the start of content to be cleared by a subsequent `clear()` call.
 */
export const clearStart = () => {
  if (TTY) {
    process.stdout.write("\n".repeat(process.stdout.rows - 1));
  }
};

/**
 * Clear stdout. `flush` determines whether to flush previous contents of
 * stdout.
 */
export const clear = (flush = true) => {
  if (TTY) {
    if (flush) {
      logCall("log", "\u001b[3J\u001b[2J\u001b[1J");
    } else {
      cursorTo(process.stdout, 0, 0);
      clearScreenDown(process.stdout);
    }
  } else {
    logCall("log", `\n  ${"-".repeat(15)} Console was cleared. ${"-".repeat(15)}\n`);
  }
};

export const info: Logger = (message, styles, options) => {
  logCall("info", style(message, styles), options);
};

export const warn: Logger = (message, styles, options) => {
  logCall("warn", style(message, styles), options);
};

export const debug: Logger = (message, styles, options) => {
  logCall("debug", style(message, styles), options);
};
