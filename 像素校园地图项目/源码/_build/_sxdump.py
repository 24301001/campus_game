import re, sys

EMU = 914400.0

def dump(path, minx=None, maxx=None, miny=None, maxy=None):
    x = open(path, encoding='utf-8').read()
    print("=== %s ===" % path)
    for i, p in enumerate(x.split('<p:sp>')[1:]):
        off = re.search(r'<a:off x="(-?\d+)" y="(-?\d+)"/><a:ext cx="(\d+)" cy="(\d+)"', p)
        if not off:
            print("%-3d (no off)" % i)
            continue
        ex, ey, cx, cy = [int(v) / EMU for v in off.groups()]
        if minx is not None and not (minx <= ex <= maxx and miny <= ey <= maxy):
            continue
        f = re.search(r'<a:solidFill><a:srgbClr val="([0-9A-Fa-f]{6})"', p)
        sch = re.search(r'<a:solidFill><a:schemeClr val="([^"]+)"', p)
        prst = re.search(r'prstGeom prst="([^"]+)"', p)
        nm = re.search(r'name="([^"]*)"', p)
        if f:
            fill = "#" + f.group(1)
        elif sch:
            fill = "scheme:" + sch.group(1)
        else:
            fill = "NONE"
        print("%-3d %-8s x=%-8.4f y=%-8.4f w=%-8.4f h=%-8.4f %-18s %s" % (
            i, prst.group(1) if prst else '?', ex, ey, cx, cy, fill,
            (nm.group(1) if nm else '').encode('ascii', 'replace').decode()))

if __name__ == '__main__':
    a = sys.argv[1:]
    if len(a) >= 5:
        dump(a[0], float(a[1]), float(a[2]), float(a[3]), float(a[4]))
    else:
        dump(a[0])
