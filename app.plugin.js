const configPlugins = require('@expo/config-plugins');
const {
  withProjectBuildGradle,
  withXcodeProject,
  createRunOncePlugin,
  withAndroidStyles,
  withAndroidColors,
  withAndroidColorsNight,
  withStringsXml,
} = configPlugins;
const { AndroidConfig } = configPlugins;
const { Resources } = AndroidConfig;

const STYLE_NAME = 'sqip.Theme.CardEntry';
const STYLE_PARENT = 'sqip.Theme.BaseCardEntry';
const EDIT_TEXT_STYLE_NAME = 'sqip.Theme.CardEntry.EditText';
const EDIT_TEXT_STYLE_PARENT = 'Widget.AppCompat.EditText';
const SAVE_BUTTON_STYLE_NAME = 'sqip.Theme.CardEntry.SaveButton';
const SAVE_BUTTON_STYLE_PARENT = 'Widget.AppCompat.Button.Colored';
const PLUGIN_PREFIX = 'sqip_card_entry_';

const COLOR_MAPPINGS = [
  {
    resourceName: `${PLUGIN_PREFIX}status_bar`,
    path: ['statusBarColor'],
    apply: (ctx, ref) => {
      ctx.themeItems['colorPrimaryDark'] = ref;
      ctx.themeItems['android:statusBarColor'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}action_bar`,
    path: ['actionBarColor'],
    apply: (ctx, ref) => {
      ctx.themeItems['colorPrimary'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}background`,
    path: ['backgroundColor'],
    apply: (ctx, ref) => {
      ctx.themeItems['android:windowBackground'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}text_hint`,
    path: ['textColorHint'],
    apply: (ctx, ref) => {
      ctx.themeItems['android:textColorHint'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}accent`,
    path: ['editTextStyle', 'accentColor'],
    apply: (ctx, ref) => {
      ctx.themeItems['colorAccent'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}error`,
    path: ['editTextStyle', 'errorColor'],
    apply: (ctx, ref) => {
      ctx.themeItems['sqipErrorColor'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}edit_text_text`,
    path: ['editTextStyle', 'textColor'],
    apply: (ctx, ref) => {
      ctx.editTextItems['android:textColor'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}edit_text_hint`,
    path: ['editTextStyle', 'hintColor'],
    apply: (ctx, ref) => {
      ctx.editTextItems['android:textColorHint'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}save_button_background`,
    path: ['saveButtonStyle', 'backgroundColor'],
    apply: (ctx, ref) => {
      ctx.saveButtonItems['android:backgroundTint'] = ref;
      ctx.saveButtonItems['android:background'] = ref;
    },
  },
  {
    resourceName: `${PLUGIN_PREFIX}save_button_text`,
    path: ['saveButtonStyle', 'textColor'],
    apply: (ctx, ref) => {
      ctx.saveButtonItems['android:textColor'] = ref;
    },
  },
];

function isDefined(value) {
  return value !== undefined && value !== null;
}

function getPath(source, path) {
  return path.reduce((current, key) => {
    if (current === undefined || current === null) return undefined;
    return current[key];
  }, source);
}

function isResourceReference(value) {
  if (!isDefined(value)) return false;
  const str = String(value).trim();
  return str.startsWith('@') || str.startsWith('?');
}

function normalizeColorValue(value) {
  const str = String(value).trim();
  if (str.startsWith('#')) return str.toUpperCase();
  if (/^0x[0-9a-fA-F]{6,8}$/.test(str)) {
    return `#${str.slice(2).toUpperCase()}`;
  }
  if (/^[0-9a-fA-F]{6}$/.test(str)) return `#${str.toUpperCase()}`;
  if (/^[0-9a-fA-F]{8}$/.test(str)) return `#${str.toUpperCase()}`;
  return str;
}

function normalizeFontSize(value) {
  if (!isDefined(value)) return null;
  if (typeof value === 'number') return `${value}sp`;
  const str = String(value).trim();
  if (!str) return null;
  if (isResourceReference(str)) return str;
  if (/(dp|sp|px|pt|mm|in)$/i.test(str)) return str;
  if (/^-?\d+(\.\d+)?$/.test(str)) return `${str}sp`;
  return str;
}

function booleanToAndroid(value) {
  return value ? 'true' : 'false';
}

function resolveColorAssignment(
  lightValue,
  darkValue,
  resourceName,
  lightColors,
  nightColors
) {
  if (!isDefined(lightValue)) return null;
  const str = String(lightValue).trim();
  if (isResourceReference(str)) {
    return { reference: str };
  }
  const normalizedLight = normalizeColorValue(str);
  lightColors[resourceName] = normalizedLight;
  if (isDefined(darkValue)) {
    const darkStr = String(darkValue).trim();
    if (!isResourceReference(darkStr)) {
      nightColors[resourceName] = normalizeColorValue(darkStr);
    }
  }
  return { reference: `@color/${resourceName}` };
}

function collectStyleArtifacts(options = {}) {
  const styleOptions =
    typeof options === 'object' && options ? { ...options } : {};
  const darkOptions =
    typeof styleOptions.dark === 'object' && styleOptions.dark
      ? styleOptions.dark
      : {};
  delete styleOptions.dark;

  const themeItems = {};
  const editTextItems = {};
  const saveButtonItems = {};
  const lightColors = {};
  const nightColors = {};

  for (const mapping of COLOR_MAPPINGS) {
    const lightValue = getPath(styleOptions, mapping.path);
    if (!isDefined(lightValue)) continue;
    const darkValue = getPath(darkOptions, mapping.path);
    const assignment = resolveColorAssignment(
      lightValue,
      darkValue,
      mapping.resourceName,
      lightColors,
      nightColors
    );
    if (!assignment) continue;
    mapping.apply(
      { themeItems, editTextItems, saveButtonItems },
      assignment.reference
    );
  }

  if (isDefined(styleOptions.fontFamily)) {
    themeItems['android:fontFamily'] = styleOptions.fontFamily;
    themeItems.fontFamily = styleOptions.fontFamily;
  }

  const editTextStyle =
    typeof styleOptions.editTextStyle === 'object' && styleOptions.editTextStyle
      ? styleOptions.editTextStyle
      : {};
  if (isDefined(editTextStyle.fontFamily)) {
    editTextItems['android:fontFamily'] = editTextStyle.fontFamily;
    editTextItems.fontFamily = editTextStyle.fontFamily;
  }
  if (isDefined(editTextStyle.textSize)) {
    const size = normalizeFontSize(editTextStyle.textSize);
    if (size) editTextItems['android:textSize'] = size;
  }
  if (isDefined(editTextStyle.textStyle)) {
    editTextItems['android:textStyle'] = String(editTextStyle.textStyle);
  }

  const saveButtonStyle =
    typeof styleOptions.saveButtonStyle === 'object' &&
    styleOptions.saveButtonStyle
      ? styleOptions.saveButtonStyle
      : {};
  if (isDefined(saveButtonStyle.fontFamily)) {
    saveButtonItems['android:fontFamily'] = saveButtonStyle.fontFamily;
    saveButtonItems.fontFamily = saveButtonStyle.fontFamily;
  }
  if (isDefined(saveButtonStyle.fontSize)) {
    const size = normalizeFontSize(saveButtonStyle.fontSize);
    if (size) saveButtonItems['android:textSize'] = size;
  }
  if (isDefined(saveButtonStyle.textAllCaps)) {
    saveButtonItems['android:textAllCaps'] = booleanToAndroid(
      saveButtonStyle.textAllCaps
    );
  }
  if (isDefined(saveButtonStyle.fontStyle)) {
    saveButtonItems['android:textStyle'] = String(saveButtonStyle.fontStyle);
  }

  const styles = [];
  let saveButtonText = null;
  if (Object.keys(editTextItems).length) {
    styles.push({
      name: EDIT_TEXT_STYLE_NAME,
      parent: EDIT_TEXT_STYLE_PARENT,
      item: editTextItems,
    });
    themeItems.editTextStyle = `@style/${EDIT_TEXT_STYLE_NAME}`;
  }
  if (Object.keys(saveButtonItems).length) {
    styles.push({
      name: SAVE_BUTTON_STYLE_NAME,
      parent: SAVE_BUTTON_STYLE_PARENT,
      item: saveButtonItems,
    });
    themeItems.buttonStyle = `@style/${SAVE_BUTTON_STYLE_NAME}`;
  }
  if (isDefined(saveButtonStyle.text)) {
    saveButtonText = String(saveButtonStyle.text);
    themeItems['sqipSaveButtonText'] = `@string/${PLUGIN_PREFIX}pay_button`;
  }

  return {
    themeItems,
    styles,
    lightColors,
    nightColors,
    saveButtonText,
  };
}

function withSquarePaymentsSDK(config, opts = {}) {
  return createRunOncePlugin(
    (cfg) => {
      const cardEntryArtifacts = collectStyleArtifacts(opts.cardEntryStyle);

      //
      // 🟢 ANDROID PART 1 insert SQIP Maven repository
      //
      cfg = withProjectBuildGradle(cfg, (mod) => {
        if (mod.modResults.language !== 'groovy') return mod;
        let src = mod.modResults.contents || '';
        const SQUARE_REPO_URL = 'https://sdk.squareup.com/public/android';
        const SQUARE_REPO_REGEX =
          /maven\s*{\s*url\s*['"]https:\/\/sdk\.squareup\.com\/public\/android['"]\s*}/;
        if (SQUARE_REPO_REGEX.test(src)) {
          mod.modResults.contents = src;
          return mod;
        }
        const repoLine = `    maven { url '${SQUARE_REPO_URL}' }`;
        const allprojectsRepositoriesRegex =
          /(allprojects\s*\{[\s\S]*?repositories\s*\{)([\s\S]*?)(\n\s*\}\s*\n\s*\})/m;
        if (allprojectsRepositoriesRegex.test(src)) {
          src = src.replace(
            allprojectsRepositoriesRegex,
            (_m, start, body, end) => {
              if (SQUARE_REPO_REGEX.test(body)) return `${start}${body}${end}`;
              const insertionPoint = body.endsWith('\n') ? body : body + '\n';
              return `${start}${insertionPoint}${repoLine}\n${end}`;
            }
          );
        } else {
          // Fallback: append a full block at the end
          src += `\nallprojects {\n  repositories {\n    ${repoLine.trim()}\n  }\n}\n`;
        }
        mod.modResults.contents = src;

        return mod;
      });

      //
      // 🟢 ANDROID PART 2 set CardEntryForm theme
      //

      cfg = withAndroidColors(cfg, (mod) => {
        const xml = Resources.ensureDefaultResourceXML(mod.modResults);
        const current = Array.isArray(xml.resources.color)
          ? xml.resources.color
          : [];
        const filtered = current.filter((item) => {
          const name = item?.$?.name;
          return !name || !name.startsWith(PLUGIN_PREFIX);
        });
        const additions = Object.entries(cardEntryArtifacts.lightColors).map(
          ([name, value]) => Resources.buildResourceItem({ name, value })
        );
        xml.resources.color = [...filtered, ...additions];
        mod.modResults = xml;
        return mod;
      });

      cfg = withAndroidColorsNight(cfg, (mod) => {
        const xml = Resources.ensureDefaultResourceXML(mod.modResults);
        const current = Array.isArray(xml.resources.color)
          ? xml.resources.color
          : [];
        const filtered = current.filter((item) => {
          const name = item?.$?.name;
          return !name || !name.startsWith(PLUGIN_PREFIX);
        });
        const additions = Object.entries(cardEntryArtifacts.nightColors).map(
          ([name, value]) => Resources.buildResourceItem({ name, value })
        );
        xml.resources.color = [...filtered, ...additions];
        mod.modResults = xml;
        return mod;
      });

      cfg = withStringsXml(cfg, (mod) => {
        const xml = Resources.ensureDefaultResourceXML(mod.modResults);
        const current = Array.isArray(xml.resources.string)
          ? xml.resources.string
          : [];
        const filtered = current.filter(
          (item) => item?.$?.name !== `${PLUGIN_PREFIX}pay_button`
        );
        if (cardEntryArtifacts.saveButtonText) {
          filtered.push(
            Resources.buildResourceItem({
              name: `${PLUGIN_PREFIX}pay_button`,
              value: String(cardEntryArtifacts.saveButtonText),
            })
          );
        }
        xml.resources.string = filtered;
        mod.modResults = xml;
        return mod;
      });

      cfg = withAndroidStyles(cfg, (mod) => {
        const xml = Resources.ensureDefaultResourceXML(mod.modResults);
        const current = Array.isArray(xml.resources.style)
          ? xml.resources.style
          : [];
        const managedNames = new Set([
          STYLE_NAME,
          EDIT_TEXT_STYLE_NAME,
          SAVE_BUTTON_STYLE_NAME,
        ]);
        const filtered = current.filter((group) => {
          const name = group?.$?.name;
          return !name || !managedNames.has(name);
        });

        if (Object.keys(cardEntryArtifacts.themeItems).length) {
          filtered.push(
            Resources.getObjectAsResourceGroup({
              name: STYLE_NAME,
              parent: STYLE_PARENT,
              item: cardEntryArtifacts.themeItems,
            })
          );
        }

        for (const styleGroup of cardEntryArtifacts.styles) {
          filtered.push(
            Resources.getObjectAsResourceGroup({
              name: styleGroup.name,
              parent: styleGroup.parent,
              item: styleGroup.item,
            })
          );
        }

        xml.resources.style = filtered;
        mod.modResults = xml;
        return mod;
      });

      //
      // 🍎 IOS PART — add Build Phase
      //
      cfg = withXcodeProject(cfg, (mod) => {
        const project = mod.modResults;

        const buildPhaseName = '[CP] Square In-App Payments SDK Setup';
        const shellScript = `
      SETUP_SCRIPT=\${BUILT_PRODUCTS_DIR}/\${FRAMEWORKS_FOLDER_PATH}/SquareInAppPaymentsSDK.framework/setup
      if [ -f "\${SETUP_SCRIPT}" ]; then
        "\${SETUP_SCRIPT}"
      fi
      `;

        // Resolve a valid native target
        const targets = project.pbxNativeTargetSection();
        const targetUuid = Object.keys(targets).find(
          (key) => !key.endsWith('_comment')
        );
        if (!targetUuid) return mod;
        const target = targets[targetUuid];

        // Avoid duplicates
        const objects = project.hash.project.objects;
        const shellPhases =
          objects.PBXShellScriptBuildPhase ||
          (objects.PBXShellScriptBuildPhase = {});
        const exists = Object.values(shellPhases).some((p) => {
          const rawName = p && p.name ? p.name : '';
          const normalized = String(rawName).replace(/^\"|\"$/g, '');
          return normalized === buildPhaseName;
        });
        if (exists) return mod;

        // Create PBXShellScriptBuildPhase using API
        project.addBuildPhase(
          [],
          'PBXShellScriptBuildPhase',
          buildPhaseName,
          targetUuid,
          {
            shellPath: '/bin/sh',
            shellScript: shellScript.trim(),
            inputPaths: [],
            outputPaths: [],
          }
        );

        return mod;
      });

      return cfg;
    },
    'react-native-square-in-app-payments',
    '1.0.0'
  )(config);
}

module.exports = withSquarePaymentsSDK;
