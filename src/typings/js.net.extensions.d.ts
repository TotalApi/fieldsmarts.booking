interface RegExpConstructor {
    escape(text: string): string;
    rebuild(regexp: RegExp, options: any): RegExp;
}

// ReSharper disable InconsistentNaming
interface String {
    /*
        /**
         * Реализация форматирования "как в C#": var str = String.Format(format, arg0[, arg1[, arg2 ...]]);
        #1#
        format(...args: any[]): string;
    */

    /**
        Checks the current string with the passed one whether they are equals. 
    */
    IsEqual(strOrRegexp: any, caseInsensitive?: boolean);

    /**
        Determines whether the beginning of this string instance matches the specified string. 
    */
    StartsWith(strOrRegexp: any, caseInsensitive?: boolean);

    /**
        Determines whether the end of this string instance matches the specified string. 
    */
    EndsWith(strOrRegexp: any, caseInsensitive?: boolean);

    /**
        Returns a value indicating whether the specified string object occurs within this string.
    */
    Contains(strOrRegexp: any, caseInsensitive?: boolean): boolean;

    /**
        Removes all leading and trailing occurrences of a set of characters specified in a string or an array from the current string.
    */
    Trim(trimChars?: string);

    /**
        Removes all leading occurrences of a set of characters specified in a string or an array from the current string. 
    */
    TrimLeft(trimChars?: string);

    /**
        Removes all leading occurrences of a set of characters specified in a string or an array from the current string. 
    */
    TrimStart(trimChars?: string);

    /**
        Removes all trailing occurrences of a set of characters specified in a string or an array from the current string. 
    */
    TrimRight(trimChars?: string);

    /**
        Removes all trailing occurrences of a set of characters specified in a string or an array from the current string. 
    */
    TrimEnd(trimChars?: string);

    /**
        Extracts directory path part from the full file path. 
    */
    ExtractDirectory(separator?: string);

    /**
        Extracts file name path part from the full file path. 
    */
    ExtractFileName(separator?: string);

    /**
        Extracts file name without extension from path.
         for 'fileName.ext' -> returns 'fileName'
         for 'fileName.' -> returns 'fileName'
         for 'fileName.name1.name2.ext' -> returns 'fileName.name1.name2'
    */
    ExtractOnlyFileName(separator?: string);

    /**
        Extracts file extension from path.
         for 'fileName.ext' -> returns 'ext'
         for 'fileName.' -> returns ''
         for 'fileName' -> returns undefined
    */
    ExtractFileExt(separator?: string);

    /**
        Changes file extension from path.
         for 'fileName.ext' { '' -> returns 'fileName'
         for 'fileName.ext' { '.newExt' or 'newExt' -> returns 'fileName.newExt'
         for 'fileName.' { '.newExt' or 'newExt' -> returns 'fileName.newExt'
         for 'fileName' { '.newExt' or 'newExt' -> returns 'fileName.newExt'
    */
    ChangeFileExt(newExt: string, separator?: string);

    /**
        Expand filename with the passed base path.

        If the base path is empty the filename will be expanded from site root origin (if filename starts with '/') 
        or from current page folder (if filename doesn't start with '/').
    */
    ExpandPath(basePath?: string, separator?: string);

    /**
        Converts string to boolean.
    */
    AsBool(defValue?: boolean): boolean;

    /**
        Returns the index of the first match of the regexp in the string. -1 if there is no match.
    */
    RegexIndexOf(regex, startPos?: number): number;

    /**
        Returns the index of the last match of the regexp in the string. -1 if there is no match.
    */
    RegexLastIndexOf(regex, startPos?: number): number;

    /**
        Searches for the specified substring or Regexp and returns the zero-based index of 
        the first occurrence within the range of elements in the strings that starts at 
        the specified index and contains the specified number of characters.
    */
    IndexOf(strOrRegexp: any, startIndex?: number, count?: number): number;

    /**
        Searches for the specified substring or Regexp and returns the zero-based index of 
        the last occurrence within the range of elements in the strings that starts at 
        the specified index and contains the specified number of characters.
    */
    LastIndexOf(strOrRegexp: any, startIndex?: number, count?: number): number;

    /**
        Converts JSON string to an object. Returns defValue for invalid or empty JSON string.
        The JSON string can be not braketed with { and  }.
    */
    FromJson(defValue): any;

    ToMd5(): string;
    /*
        HtmlEncode(): string;
    
        HtmlDecode(): string;
    */
}

interface Array<T> {
/*
    /**
        Concatanate the array with the values and returns new copy of the result array. 
    #1#
    _(...values: (T[] | T)[]): T[];

    /**
        Concatanate the array with the values and returns new copy of the result array. 
    #1#
    Concat(...values: (T[] | T)[]): T[];
*/

    /**
        Make the copy of the source array. 
    */
    clone();

    /** 
        Adds objects to the end of the array.
    */
    Add(...values: T[]): Array<T>;

    /** 
        Adds the elements of the specified collection to the end of the array.
    */
    AddRange(values: T[]): Array<T>;

    /**
        Inserts elements into the array at the specified zero-based index.
    */
    Insert(index: number, ...values: T[]): Array<T>;

    /**
        Inserts the elements of a collection into the array at the specified zero-based index.
    */
    InsertRange(index: number, ...values: T[]): Array<T>;

    /**
        Determines whether an element is in the array.
    */
    Contains(element: T): boolean;

    /**
        Removes all elements from the array.
    */
    Clear(): Array<T>;

    /**
        Removes the elements from the specified index of the array. If count is not specified removes one element.
    */
    RemoveAt(index: number, count?: number): Array<T>;

    /**
        Removes a range of elements from the array.
    */
    RemoveRange(index: number, count: number): Array<T>;

    /**
        Removes the first occurrence of specific elements from the array.
    */
    Remove(...elements: T[]): Array<T>;
    /**
        Removes specific elements matched specified condition from the array.
    */
    Remove(condition: (el: T) => boolean): Array<T>;

    /**
        Creates a shallow copy of a range of elements in the source array. If count is not specified returns the rest of the array from specified index.
    */
    GetRange(index: number, count?: number): Array<T>;

    /**
        Searches for the specified object and returns the zero-based index of the first occurrence within the range 
        of elements in the array that starts at the specified index and contains the specified number of elements.
    */
    IndexOf(element: T, startIndex?: number, count?: number): number;

    /**
        Searches for the specified object and returns the zero-based index of the last occurrence within the range 
        of elements in the array that contains the specified number of elements and ends at the specified index.
    */
    LastIndexOf(element: T, startIndex?: number, count?: number): number;
}
