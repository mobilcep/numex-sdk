const { spawn } = require('child_process');

/**
 * Clean helper to extract the last valid JSON object or array from stdout string
 */
function parseLastJson(stdout) {
  if (!stdout || typeof stdout !== 'string') return null;
  const clean = stdout.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, '');
  const lines = clean.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    if ((line.startsWith('{') && line.endsWith('}')) || (line.startsWith('[') && line.endsWith(']'))) {
      try {
        return JSON.parse(line);
      } catch (_) {}
    }
  }
  return null;
}

/**
 * Programmatic CLI bridge for Numex CLI execution.
 */
class NumexBridge {
  constructor(options = {}) {
    this._command = options.command || 'numex';
    this._getCwd = options.getCwd || (() => process.cwd());
    this._shell = options.shell === true;
  }

  /**
   * Executes CLI command with arguments and returns structured result object.
   * @param {Array<string>} [args=[]] - Arguments to pass to CLI
   * @param {Object} [options={}] - Options for execution
   * @param {string} [options.cwd] - Custom working directory
   * @param {Object} [options.env] - Custom environment variables
   * @param {number} [options.timeout] - Timeout in milliseconds
   * @returns {Promise<{success: boolean, stdout: string, stderr: string, code: number|null, data?: any, error?: string}>}
   */
  run(args = [], options = {}) {
    return new Promise((resolve) => {
      const command = options.command || this._command;
      const cwd = options.cwd || (this._getCwd ? this._getCwd() : process.cwd());
      const env = options.env ? { ...process.env, ...options.env } : process.env;
      const shell = options.shell !== undefined ? options.shell : this._shell;
      const timeout = typeof options.timeout === 'number' && options.timeout > 0 ? options.timeout : null;

      let proc;
      let timer = null;
      let killedByTimeout = false;

      try {
        proc = spawn(command, Array.isArray(args) ? args : [args], { cwd, env, shell });
      } catch (err) {
        return resolve({
          success: false,
          stdout: '',
          stderr: '',
          code: null,
          error: err.message || 'CLI süreci başlatılamadı.'
        });
      }

      let stdout = '';
      let stderr = '';

      if (timeout) {
        timer = setTimeout(() => {
          killedByTimeout = true;
          try {
            if (process.platform === 'win32') {
              spawn('taskkill', ['/pid', String(proc.pid), '/T', '/F'], { stdio: 'ignore' });
            } else {
              proc.kill('SIGKILL');
            }
          } catch (_) {
            try { proc.kill(); } catch (_) {}
          }
        }, timeout);
      }

      if (proc.stdout) {
        proc.stdout.on('data', (d) => { stdout += d.toString(); });
      }
      if (proc.stderr) {
        proc.stderr.on('data', (d) => { stderr += d.toString(); });
      }

      proc.on('error', (err) => {
        if (timer) clearTimeout(timer);
        resolve({
          success: false,
          stdout,
          stderr,
          code: null,
          error: err.message || 'CLI yürütme hatası'
        });
      });

      proc.on('close', (code) => {
        if (timer) clearTimeout(timer);

        if (killedByTimeout) {
          return resolve({
            success: false,
            stdout,
            stderr,
            code: null,
            error: `CLI komutu zaman aşımına uğradı (${timeout}ms)`
          });
        }

        if (code !== 0 && code !== null) {
          return resolve({
            success: false,
            stdout,
            stderr,
            code,
            error: stderr.trim() || `CLI komutu ${code} çıkış kodu ile sonlandı.`
          });
        }

        const parsedData = parseLastJson(stdout);
        const data = parsedData !== null ? parsedData : stdout.trim();

        resolve({
          success: true,
          stdout,
          stderr,
          code: 0,
          data
        });
      });
    });
  }

  /**
   * Helper method for simple JSON output retrieval
   */
  async runJson(args = [], options = {}) {
    const res = await this.run(args, options);
    return res.success ? res.data : null;
  }
}

module.exports = { NumexBridge, parseLastJson };
